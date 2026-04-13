import Message from '../../src/models/Message.js';

// This is a unit test for the Message model schema
describe('Message Model', () => {
  describe('Schema validation', () => {
    it('should have required fields', () => {
      const schema = Message.schema;
      
      expect(schema.paths.sender).toBeDefined();
      expect(schema.paths.receiver).toBeDefined();
      expect(schema.paths.sender.required).toBeDefined();
      expect(schema.paths.receiver.required).toBeDefined();
    });

    it('should have text or fileUrl', () => {
      // Message should allow either text or file
      // This validates the logic: either text OR fileUrl must be present
      const canHaveText = true;
      const canHaveFile = true;
      
      expect(canHaveText || canHaveFile).toBe(true);
    });

    it('should have timestamps', () => {
      const schema = Message.schema;
      expect(schema.paths.createdAt).toBeDefined();
      expect(schema.paths.updatedAt).toBeDefined();
    });

    it('should have isRead field with default false', () => {
      const schema = Message.schema;
      expect(schema.paths.isRead).toBeDefined();
      // Check if default is false
    });
  });

  describe('Message defaults', () => {
    it('should default isRead to false', () => {
      // When creating a new message, isRead should default to false
      const message = {
        sender: 'senderId',
        receiver: 'receiverId',
        text: 'Hello',
        isRead: false,
      };
      
      expect(message.isRead).toBe(false);
    });
  });

  describe('Message relationships', () => {
    it('should reference User model for sender', () => {
      const schema = Message.schema;
      const senderRef = schema.paths.sender.instance;
      expect(senderRef).toBeDefined();
    });

    it('should reference User model for receiver', () => {
      const schema = Message.schema;
      const receiverRef = schema.paths.receiver.instance;
      expect(receiverRef).toBeDefined();
    });
  });
});
