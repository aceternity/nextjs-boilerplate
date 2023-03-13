import bcrypt from 'bcryptjs';

class HashUtil {
  static async createHash(plaintext: string): Promise<string> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plaintext, saltRounds);
    return hash;
  }

  static async compareHash(plaintext: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(plaintext, hash);
    return match;
  }
}

export default HashUtil;