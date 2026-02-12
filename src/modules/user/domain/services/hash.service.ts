interface CompareHashServiceArgs {
  hashed: string;
  plain: string;
}

export type CompareHashService = (
  args: CompareHashServiceArgs,
) => Promise<boolean>;

export type HashService = (value: string) => Promise<string>;
