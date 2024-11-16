import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// AIClient implementation
export class AIClient {
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
    Just return the number of price estimation.
    The max price is 0.01 ETH.
  `;

  // Add useEffect to auto-run estimation
  useEffect(() => {
    handleEstimate();
  }, [project]); // Re-run when project changes

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
    <div>
      {isLoading ? (
        <p>Estimating price...</p>
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
      )}
    </div>
  );
};

export default AiPriceEstimator;
