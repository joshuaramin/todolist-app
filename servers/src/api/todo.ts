import {
  asNexusMethod,
  extendType,
  idArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { PrismaClient } from "@prisma/client";
import { GraphQLDate } from "graphql-scalars";
import { isDate, toDate } from "date-fns";
const prisma = new PrismaClient();

export const GQLDate = asNexusMethod(GraphQLDate, "date");

export const todoObj = objectType({
  name: "todo",
  definition(t) {
    t.id("todoID"), t.string("todolist"), t.date("createdAt");
  },
});
export const result = toDate(new Date());

export const todoQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("todoQuery", {
      type: "todo",
      resolve: async (): Promise<any> => {
        return await prisma.todo.findMany();
      },
    });
  },
});

export const todoMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTodo", {
      type: "todo",
      args: { todolist: nonNull(stringArg()) },
      resolve: async (_, { todolist }): Promise<any> => {
        return await prisma.todo.create({
          data: { todolist, createdAt: result },
        });
      },
    });
    t.field("deleteTodo", {
      type: "todo",
      args: { todoID: nonNull(idArg()) },
      resolve: async (_, { todoID }): Promise<any> => {
        return await prisma.todo.delete({ where: { todoID } });
      },
    });
    t.field("updateTodo", {
      type: "todo",
      args: { todoID: nonNull(idArg()), todolist: nonNull(stringArg()) },
      resolve: async (_, { todoID, todolist }): Promise<any> => {
        return await prisma.todo.update({
          where: { todoID },
          data: { todolist },
        });
      },
    });
  },
});
