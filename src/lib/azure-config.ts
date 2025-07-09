// Azure OpenAI Configuration
// Note: In a production environment, these values should be stored in environment variables
// or a secure configuration service, not hardcoded in the application

// Using a mutable object to allow updating the config from the UI
export const azureConfig = {
  // Default values - these should be configured through the UI in this client-side app
  endpoint: "your-endpoint.openai.azure.com",
  apiKey: "", // Never hardcode actual API keys
  deploymentName: "gpt-35-turbo", // Common deployment name for GPT-3.5 Turbo
  apiVersion: "2024-02-15-preview" // Updated to a more recent API version
};

// Function to update the config
export function updateAzureConfig(config: {
  endpoint?: string;
  apiKey?: string;
  deploymentName?: string;
}): void {
  if (config.endpoint) azureConfig.endpoint = config.endpoint;
  if (config.apiKey) azureConfig.apiKey = config.apiKey;
  if (config.deploymentName) azureConfig.deploymentName = config.deploymentName;
}

// Function to check if Azure OpenAI is properly configured
export function isConfigValid(): boolean {
  return (
    !!azureConfig.apiKey && 
    azureConfig.apiKey.length > 10 && 
    !!azureConfig.endpoint && 
    !azureConfig.endpoint.includes("your-endpoint") &&
    !!azureConfig.deploymentName &&
    azureConfig.deploymentName !== "your-deployment-name"
  );
}