import njwt from "njwt";

class TokenService {
  static getAccessToken(projectId: string) {
    const jwt = njwt.create(
      {
        project_id: projectId,
      },
      process.env.SUPABASE_SIGNATURE
    );
    jwt.setExpiration("");
    jwt.setSigningAlgorithm("HS256");

    return jwt.compact();
  }
}

export { TokenService };
