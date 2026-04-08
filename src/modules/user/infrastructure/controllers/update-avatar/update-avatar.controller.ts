import type { RouteHandler } from "fastify";
import { getAuthenticatedUser } from "../../../../shared/infrastructure/services/auth.service";
import { uploadImageService } from "../../../../shared/infrastructure/services/cloudinary.service";
import { updateAvatarUseCase } from "../../../application/use-cases/update-avatar/update-avatar.uc";
import { updateUserAvatarRepository } from "../../data-base/user.db";

export const updateAvatarController: RouteHandler<{}> = async (
  request,
  response,
) => {
  const authResult = getAuthenticatedUser(request);
  if (!authResult.success) {
    return response.status(401).send({ message: authResult.error });
  }
  const user = authResult.value;

  const data = await request.file();
  if (!data) {
    return response.status(400).send({ message: "No se envió ninguna imagen" });
  }

  try {
    const fileBuffer = await data.toBuffer();

    const result = await updateAvatarUseCase({
      updateAvatarRepository: updateUserAvatarRepository,
      uploadImageService,
    })(user.id, user.username, fileBuffer);

    if (!result.success)
      return response
        .status(500)
        .send({ message: "Error procesando la imagen en el servidor" });

    return response.status(200).send({ avatarUrl: result.value.avatarUrl });
  } catch (_error) {
    return response
      .status(500)
      .send({ message: "Error procesando la imagen en el servidor" });
  }
};
