// Azure OpenAI Configuration
// Note: In a production environment, these values should be stored in environment variables
// or a secure configuration service, not hardcoded in the application

// Using a mutable object to allow updating the config from the UI
export const azureConfig = {
  // Default values - these should be configured through the UI in this client-side app
  endpoint: "your-endpoint.openai.azure.com",
  apiKey: "", // Never hardcode actual API keys
  deploymentName: "your-deployment-name",
  apiVersion: "2023-05-15"
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