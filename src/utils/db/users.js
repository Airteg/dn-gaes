import clientPromise from "../db.js";
import { ObjectId } from "mongodb";

export async function getUsers({
  page = 1,
  limit = 10,
  filter = "",
  showDeleted = false,
} = {}) {
  const client = await clientPromise;
  const db = client.db("dn-gaes");

  const query = {
    ...(filter
      ? {
          $or: [
            { firstName: { $regex: filter, $options: "i" } },
            { lastName: { $regex: filter, $options: "i" } },
            { email: { $regex: filter, $options: "i" } },
          ],
        }
      : {}),
    ...(showDeleted ? {} : { isDeleted: { $ne: true } }),
  };

  const users = await db
    .collection("users")
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const total = await db.collection("users").countDocuments(query);

  return {
    users: users.map((user) => ({
      ...user,
      _id: user._id.toString(),
      name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "",
    })),
    total,
  };
}

export async function updateUser(id, data) {
  const client = await clientPromise;
  const db = client.db("dn-gaes");

  const updateData = {
    ...(data.name
      ? {
          firstName: data.name.trim().split(" ")[0],
          lastName: data.name.trim().split(" ").slice(1).join(" ") || "",
        }
      : {}),
    ...(data.role ? { role: data.role } : {}),
    ...(data.status ? { status: data.status } : {}),
    ...(typeof data.isDeleted === "boolean"
      ? { isDeleted: data.isDeleted }
      : {}),
    updatedAt: new Date(),
  };

  const result = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  return result;
}

export async function markUserAsDeleted(id) {
  const client = await clientPromise;
  const db = client.db("dn-gaes");

  const result = await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { isDeleted: true, updatedAt: new Date() } },
    );

  return result;
}
