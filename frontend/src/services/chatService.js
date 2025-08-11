const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

class ChatService {
    async sendMessage(prompt) {
      try {
        // Use the same base URL as defined in env
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: prompt,
          credentials: 'include', // Include cookies for authentication
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.text();
        return data;
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    }
  }
  
  const chatService = new ChatService();
  
  export default chatService;