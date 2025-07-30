class ChatService {
    async sendMessage(prompt) {
      try {
        // Use the same base URL as defined in api.js
        const response = await fetch('http://localhost:8080/api/v1/chat', {
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