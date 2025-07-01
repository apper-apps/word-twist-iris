import mockEvents from '@/services/mockData/events';

let events = [...mockEvents];
let nextId = Math.max(...events.map(e => e.Id)) + 1;

const eventService = {
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...events]);
      }, 300);
    });
  },

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = events.find(e => e.Id === parseInt(id));
        if (event) {
          resolve({ ...event });
        } else {
          reject(new Error('Event not found'));
        }
      }, 200);
    });
  },

  async create(eventData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent = {
          ...eventData,
          Id: nextId++,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        events.push(newEvent);
        resolve({ ...newEvent });
      }, 400);
    });
  },

  async update(id, eventData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = events.findIndex(e => e.Id === parseInt(id));
        if (index !== -1) {
          events[index] = {
            ...events[index],
            ...eventData,
            Id: parseInt(id),
            updatedAt: new Date().toISOString()
          };
          resolve({ ...events[index] });
        } else {
          reject(new Error('Event not found'));
        }
      }, 400);
    });
  },

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = events.findIndex(e => e.Id === parseInt(id));
        if (index !== -1) {
          const deletedEvent = events.splice(index, 1)[0];
          resolve({ ...deletedEvent });
        } else {
          reject(new Error('Event not found'));
        }
      }, 300);
    });
  },

  async getByType(type) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredEvents = events.filter(e => e.type === type);
        resolve([...filteredEvents]);
      }, 300);
    });
  },

  async getUpcoming() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const upcomingEvents = events.filter(e => new Date(e.date) > now);
        resolve([...upcomingEvents]);
      }, 300);
    });
  }
};

export default eventService;