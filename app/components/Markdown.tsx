'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import type { Components } from 'react-markdown'
import type { ComponentPropsWithoutRef } from 'react'

interface CodeProps extends ComponentPropsWithoutRef<'code'> {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

interface MarkdownProps {
  content: string
}

export default function Markdown({ content }: MarkdownProps) {
  // 预处理内容，将数学公式转换为 HTML
  const processContent = (text: string) => {
    let processed = text;
    const mathElements: string[] = [];
    
    processed = processed.replace(/\[(.*?)\]|\\\((.*?)\\\)|\\\[(.*?)\\\)/g, (match, p1, p2, p3) => {
      const formula = p1 || p2 || p3;
      try {
        const html = katex.renderToString(formula, {
          displayMode: match.startsWith('['),
          throwOnError: false,
          strict: false,
          trust: true,
          macros: {
            "\\boxed": "\\bbox[border: 1px solid]{#1}"
          }
        });
        mathElements.push(html);
        return `%%MATH_${mathElements.length - 1}%%`;
      } catch (e) {
        console.error('KaTeX error:', e);
        return match;
      }
    });

    // 创建自定义组件来渲染数学公式
    const components: Components = {
      p: ({ children, ...props }) => {
        if (typeof children === 'string') {
          let content = children;
          mathElements.forEach((html, i) => {
            content = content.replace(
              `%%MATH_${i}%%`,
              `<span class="math-wrapper">${html}</span>`
            );
          });
          return <p {...props} dangerouslySetInnerHTML={{ __html: content }} />;
        }
        return <p {...props}>{children}</p>;
      },
      code: ({ className, children, ...props }: CodeProps) => {
        const match = /language-(\w+)/.exec(className || '');
        const isInline = !match && !className;
        if (!isInline && match) {
          const language = match[1];
          return (
            <div className="syntax-highlighter-wrapper">
              <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          );
        }
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
    };

    return { processed, components };
  };

  const { processed, components } = processContent(content);

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {processed}
      </ReactMarkdown>

      <style jsx global>{`
        .markdown-body {
          font-size: 1rem;
          line-height: 1.6;
        }
        .markdown-body .katex {
          font-size: 1.1em;
          line-height: 1.2;
          text-rendering: auto;
        }
        .markdown-body .katex-display {
          margin: 0.5em 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
        .markdown-body .katex-html {
          overflow-x: auto;
          overflow-y: hidden;
        }
        .markdown-body p {
          margin: 0.5em 0;
        }
        .markdown-body .math-wrapper {
          display: inline-block;
          vertical-align: middle;
        }
        .markdown-body .math-wrapper .katex-display {
          margin: 0;
        }
        .markdown-body .syntax-highlighter-wrapper {
          margin: 1em 0;
        }
      `}</style>
    </div>
  );
} 