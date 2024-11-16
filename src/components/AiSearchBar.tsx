import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Support GitHub-flavored markdown
import { dummyProjects } from "@/app/project/[id]/page"; // Import dummy projects
import Link from 'next/link';

// AIClient for interaction with the custom AI API
class AIClient {
  static API_KEY = "sk-m4WnROxbmV6xIj9xxMOfZ7AIyOqhXO3HzYLyDjB3wdgwVEDr";
  static BASE_URL = "https://api.red-pill.ai/v1/chat/completions";
  static DEFAULT_MODEL = "gpt-4o";

  static async send(message: string, model: string = AIClient.DEFAULT_MODEL): Promise<string> {
    const headers = {
      Authorization: `Bearer ${AIClient.API_KEY}`,
      "Content-Type": "application/json",
    };
    const data = {
      model,
      messages: [{ role: "user", content: message }],
    };

    try {
      const response = await fetch(AIClient.BASE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        return result.choices[0].message.content;
      } else {
        return `Error: ${response.status}, ${await response.text()}`;
      }
    } catch (error: any) {
      return `Request failed: ${error.message}`;
    }
  }
}

const formatProjectForPrompt = (project: any) => {
  return `${project.projectName}: ${project.projectDescription}; benefits include patent licensing profit-sharing and early access to technology.`;
};

const formatResponse = (response: string) => {
  let formattedResponse = response;
  
  // Add links to project titles by matching them with dummyProjects
  Object.entries(dummyProjects).forEach(([id, project]) => {
    const projectNameRegex = new RegExp(`(${project.projectName})`, 'g');
    formattedResponse = formattedResponse.replace(
      projectNameRegex,
      `[${project.projectName}](/project/${id})`
    );
  });
  
  // Format lists
  formattedResponse = formattedResponse.replace(
    /(?:^|\n)[-•]\s/g,
    '\n* '
  );
  
  // Add emphasis to key points
  formattedResponse = formattedResponse.replace(
    /(benefits include|advantages|features|recommended|suggestion|key points)/gi,
    '**$1**'
  );
  
  return formattedResponse;
};

const AiSearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>(""); // User query
  const [result, setResult] = useState<string>(""); // AI result or message
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Create dynamic prompt from dummy projects
  const fixedPrompt = `
    I am an AI assistant for ChainIP Launchpad, a platform for patent and intellectual property crowdfunding. 
    These are our current projects:
    ${Object.values(dummyProjects)
      .map(project => 
        `${project.projectName}: ${project.projectDescription} 
        Status: ${project.finalized ? 'Successfully Funded' : 'Ongoing'}
        Current Amount: ${project.currentAmount} ETH of ${project.targetAmount} ETH target`
      )
      .join('\n\n')}

    Based on these projects, I can help answer questions about:
    - Project details and their current funding status
    - Investment opportunities and benefits
    - Patent licensing and profit-sharing mechanisms
    - Technology comparisons and recommendations

    Please provide your question:
  `;

  const handleGenerate = async () => {
    if (!query.trim()) {
      setResult("Please enter a query.");
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const fullPrompt = `${fixedPrompt}${query}\n\nPlease format your response with clear sections, bullet points for lists, and highlight key information.`;
      const aiResult = await AIClient.send(fullPrompt);
      setResult(formatResponse(aiResult) || "No result found.");
    } catch (error) {
      console.error("Error generating AI result:", error);
      setResult("Error generating result. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleGenerate();
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        AI Assistant
      </button>

      {/* Floating Card */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Floating Window */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">AI Project Assistant</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="mb-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Ask about projects, technologies, or investment opportunities..."
                />
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`mt-2 w-full px-4 py-2 text-white rounded-lg ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300"
                  }`}
                >
                  {isLoading ? "Thinking..." : "Ask AI Assistant"}
                </button>
              </div>

              {result && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h3: ({node, ...props}) => (
                          <h3 className="text-lg font-semibold text-blue-600 mt-4 mb-2" {...props} />
                        ),
                        ul: ({node, ...props}) => (
                          <ul className="list-disc pl-4 space-y-1 my-2" {...props} />
                        ),
                        li: ({node, ...props}) => (
                          <li className="text-gray-700" {...props} />
                        ),
                        p: ({node, ...props}) => (
                          <p className="my-2 text-gray-800" {...props} />
                        ),
                        strong: ({node, ...props}) => (
                          <strong className="font-semibold text-gray-900" {...props} />
                        ),
                        a: ({node, ...props}) => (
                          <Link 
                            href={props.href || '#'} 
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(false);
                            }}
                            {...props} 
                          />
                        ),
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AiSearchBar;
