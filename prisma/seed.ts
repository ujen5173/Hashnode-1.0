import { prisma } from "~/server/db";

const main = async () => {
  await prisma.user.delete({
    where: {
      id: "clk2kd56a0000mm08jc41uoxq",
    },
  });
  console.log("success!");
};

void main();
