const url = "/users/:id/notifications";

const responseBody = {
  data: [
    {
      fromUser: "Vivek",
      message: "Hello",
      status: "read",
      type: "chat",
    },
    {
      fromUser: "naresh",
      message: "Naresh requested for a match",
      status: "unread",
      type: "match",
    },
  ],
  count: 2,
  unreadCount: 1,
};
