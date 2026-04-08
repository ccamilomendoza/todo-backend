import { ok } from "../../../../shared/domain/rules/result/result.rules";
import type { UploadImageService } from "../../../../shared/domain/services/images.service";
import type { Result } from "../../../../shared/domain/types/result.type";
import type { UpdateAvatarRepository } from "../../../domain/repositories/user.repository";
import type { UploadAvatarResponsePayload } from "../../../domain/types/payloads.types";

interface UpdateAvatarUseCaseDeps {
  updateAvatarRepository: UpdateAvatarRepository;
  uploadImageService: UploadImageService;
}

export const updateAvatarUseCase =
  ({ updateAvatarRepository, uploadImageService }: UpdateAvatarUseCaseDeps) =>
  async (
    userId: string,
    username: string,
    fileBuffer: Buffer,
  ): Promise<Result<UploadAvatarResponsePayload, void>> => {
    const avatarUrl = await uploadImageService({
      fileBuffer,
      folder: `todo-backend/avatars/${username}`,
    });

    await updateAvatarRepository({ avatarUrl, userId });

    return ok({ avatarUrl });
  };
