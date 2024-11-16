import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// AIClient implementation
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

interface ProjectPriceData {
  projectName: string;
  projectDescription: string;
  targetAmount: string;
  currentAmount: string;
  contributors: {
    address: string;
    amount: string;
  }[];
}

interface Props {
  project: ProjectPriceData;
  onEstimationComplete?: (price: string) => void;
}

const AiPriceEstimator: React.FC<Props> = ({ project, onEstimationComplete }) => {
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Create dynamic prompt based on project data
  const fixedPrompt = `
    As an AI price estimation expert for ChainIP Launchpad, analyze this patent project:
    
    Project: ${project.projectName}
    Description: ${project.projectDescription}
    Current Target Price: ${project.targetAmount} ETH
    Current Raised: ${project.currentAmount} ETH
    Number of Contributors: ${project.contributors.length}
    Average Contribution: ${(Number(project.currentAmount) / Math.max(project.contributors.length, 1)).toFixed(2)} ETH

    Based on these factors:
    1. Project complexity and innovation level
    2. Market potential and application scope
    3. Current investor interest (number of contributors)
    4. Industry standards and comparable patents
    
    Please provide the recommended price for this project.
    Return only the price estimation, no other text.
  `;

  const handleEstimate = async () => {
    setIsLoading(true);
    setResult("");

    try {
      const aiResult = await AIClient.send(fixedPrompt);
      setResult(aiResult || "No estimation available.");
      if (onEstimationComplete) {
        onEstimationComplete(aiResult);
      }
    } catch (error) {
      console.error("Error generating price estimation:", error);
      setResult("Error generating estimation. Please try again.");
    } finally {
      setIsLoading(false);
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
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4zm6 1a1 1 0 10-2 0v1a1 1 0 102 0V5z" clipRule="evenodd" />
        </svg>
        AI Price Estimator
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
              <h2 className="text-lg font-semibold">AI Price Estimation</h2>
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
                <button
                  onClick={handleEstimate}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 text-white rounded-lg ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300"
                  }`}
                >
                  {isLoading ? "Analyzing..." : "Generate Price Estimation"}
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

export default AiPriceEstimator;
