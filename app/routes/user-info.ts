import { json, type LoaderFunctionArgs } from "@remix-run/node";
import {
  UserInfoService,
  UserInfoServiceError,
} from "~/services/user-info.service";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const userInfo = await UserInfoService.getUserInfo(request);
    return json(
      { userInfo },
      {
        headers: {
          "Cache-Control": "private, max-age=60",
        },
      }
    );
  } catch (error) {
    console.error("Error in user-info loader:", error);

    if (error instanceof UserInfoServiceError) {
      throw json({ error: error.message }, { status: 500 });
    }

    throw json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
