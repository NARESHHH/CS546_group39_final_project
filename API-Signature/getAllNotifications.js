const url = "/users/:id/notifications";

const responseBody = {
  data: [
    {
      fromUser: "Vivek",
      status: "read",
      type: "chat",
    },
    {
      fromUser: "naresh",
      status: "unread",
      type: "match",
    },
  ],
  total: 2,
  unreadCount: 1,
};
