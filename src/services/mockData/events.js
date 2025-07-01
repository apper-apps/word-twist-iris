const mockEvents = [
  {
    Id: 1,
    title: "Sarah's Birthday Party",
    type: "birthday",
    date: "2024-03-15T19:00:00.000Z",
    location: "Downtown Restaurant",
    description: "Celebrating Sarah's 25th birthday with friends and family. Dinner, drinks, and dancing!",
    guests: [
      { name: "John Smith", email: "john@example.com", status: "confirmed" },
      { name: "Emma Wilson", email: "emma@example.com", status: "pending" },
      { name: "Mike Johnson", email: "mike@example.com", status: "confirmed" }
    ],
    organizer: "Alex Thompson",
    budget: 500,
    status: "planned",
    createdAt: "2024-02-15T10:00:00.000Z",
    updatedAt: "2024-02-20T14:30:00.000Z"
  },
  {
    Id: 2,
    title: "Company Holiday Party",
    type: "party",
    date: "2024-12-20T18:00:00.000Z",
    location: "Grand Ballroom, City Hotel",
    description: "Annual company holiday celebration with awards, dinner, and entertainment.",
    guests: [
      { name: "Jennifer Davis", email: "jennifer@company.com", status: "confirmed" },
      { name: "Robert Brown", email: "robert@company.com", status: "confirmed" },
      { name: "Lisa Garcia", email: "lisa@company.com", status: "pending" },
      { name: "David Miller", email: "david@company.com", status: "confirmed" }
    ],
    organizer: "HR Department",
    budget: 2500,
    status: "planned",
    createdAt: "2024-10-01T09:00:00.000Z",
    updatedAt: "2024-10-15T16:45:00.000Z"
  },
  {
    Id: 3,
    title: "Team Building Workshop",
    type: "event",
    date: "2024-03-08T09:00:00.000Z",
    location: "Conference Center",
    description: "Interactive team building activities and workshops to improve collaboration.",
    guests: [
      { name: "Amanda Clark", email: "amanda@team.com", status: "confirmed" },
      { name: "Chris Wilson", email: "chris@team.com", status: "confirmed" },
      { name: "Rachel Lee", email: "rachel@team.com", status: "confirmed" }
    ],
    organizer: "Team Lead",
    budget: 800,
    status: "active",
    createdAt: "2024-02-10T11:30:00.000Z",
    updatedAt: "2024-02-25T08:15:00.000Z"
  },
  {
    Id: 4,
    title: "Wedding Anniversary Celebration",
    type: "party",
    date: "2024-06-10T17:30:00.000Z",
    location: "Garden Venue",
    description: "Celebrating 10 years of marriage with close friends and family in a beautiful garden setting.",
    guests: [
      { name: "Mark Thompson", email: "mark@example.com", status: "confirmed" },
      { name: "Susan Anderson", email: "susan@example.com", status: "confirmed" },
      { name: "Paul Martinez", email: "paul@example.com", status: "pending" },
      { name: "Nancy Rodriguez", email: "nancy@example.com", status: "confirmed" }
    ],
    organizer: "Anniversary Couple",
    budget: 1200,
    status: "planned",
    createdAt: "2024-04-05T14:20:00.000Z",
    updatedAt: "2024-04-20T10:00:00.000Z"
  },
  {
    Id: 5,
    title: "Mom's 60th Birthday",
    type: "birthday",
    date: "2024-04-22T15:00:00.000Z",
    location: "Family Home",
    description: "Intimate family gathering to celebrate Mom's milestone birthday with her favorite cake and memories.",
    guests: [
      { name: "Tom Wilson", email: "tom@family.com", status: "confirmed" },
      { name: "Julie Wilson", email: "julie@family.com", status: "confirmed" },
      { name: "Steve Wilson", email: "steve@family.com", status: "confirmed" }
    ],
    organizer: "The Wilson Family",
    budget: 300,
    status: "planned",
    createdAt: "2024-03-01T12:00:00.000Z",
    updatedAt: "2024-03-10T18:30:00.000Z"
  }
];

export default mockEvents;