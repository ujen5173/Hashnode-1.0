const { prisma } = require("~/server/db");

const main = async () => {
  await prisma.user.deleteMany({});
};

void main();
