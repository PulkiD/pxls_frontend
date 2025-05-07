// Default colors in case the environment variable is not set or is invalid
const DEFAULT_NODE_COLORS: { [key: string]: string } = {
    gene: '#FF6B6B',     // bright coral red
    disease: '#4ECDC4',  // bright turquoise
    drug: '#45B7D1',    // bright blue
    pathway: '#96CEB4',   // bright sage green
    // Add other default node types and their colors as needed
  };
  
  /**
   * Retrieves node color configurations.
   * It first tries to load colors from an environment variable.
   * If the environment variable is not set, is malformed, or an error occurs,
   * it falls back to predefined default colors.
   * * The environment variable should contain a JSON string mapping node types to color codes.
   * Example (.env file for Create React App):
   * REACT_APP_NODE_COLORS='{"gene":"#FF0000", "customType":"#00FF00"}'
   * * For Vite projects, you would define VITE_NODE_COLORS in your .env file
   * and access it in the code using import.meta.env.VITE_NODE_COLORS.
   */
  export const getNodeColors = (): { [key: string]: string } => {
    try {
      // For Vite, use import.meta.env.VITE_NODE_COLORS
      const envColors = import.meta.env.VITE_NODE_COLORS;
  
      if (!envColors) {
        // Environment variable not found, return default colors
        return DEFAULT_NODE_COLORS;
      }
      
      // The environment variable might be a string that includes its own quotes,
      // e.g., from a .env file: VITE_NODE_COLORS='{"gene":"#ABCDEF"}'
      // This line removes such surrounding single or double quotes.
      const cleanJson = envColors.replace(/^['"]|['"]$/g, '');
      
      const parsedColors = JSON.parse(cleanJson);
      
      // Merge default colors with parsed colors from the environment.
      // This ensures that any types defined in the environment override defaults,
      // and any types not in the environment but in defaults are still available.
      return {
        ...DEFAULT_NODE_COLORS,
        ...parsedColors,
      };
    } catch (error) {
      console.error(
        'Error parsing node colors from environment variable (e.g., VITE_NODE_COLORS). Using default colors.',
        error
      );
      // Fallback to default colors if parsing fails
      return DEFAULT_NODE_COLORS;
    }
  };
  
  // Example of how to use it:
  // const colors = getNodeColors();
  // const geneColor = colors['gene'] || '#CCCCCC'; // Fallback if 'gene' isn't in colors