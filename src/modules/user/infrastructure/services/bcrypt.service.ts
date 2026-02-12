import { compare, hash } from "bcrypt";
import type {
  CompareHashService,
  HashService,
} from "user/domain/services/hash.service";

export const hashService: HashService = async (
  value: string,
): Promise<string> => {
  const saltRounds = 10;

  return await hash(value, saltRounds);
};

export const compareHashService: CompareHashService = async ({
  hashed,
  plain,
}): Promise<boolean> => {
  return await compare(plain, hashed);
};
