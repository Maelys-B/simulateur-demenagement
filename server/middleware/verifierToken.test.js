import jwt from 'jsonwebtoken';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import verifierToken from './verifierToken.js';

describe('verifierToken', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renvoie 401 si aucun header Authorization n'est fourni", () => {
    verifierToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('renvoie 401 si le token est invalide', () => {
    req.headers.authorization = 'Bearer faux-token';
    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('invalid token');
    });

    verifierToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('appelle next() et remplit req.userId si le token est valide', () => {
    req.headers.authorization = 'Bearer vrai-token';
    vi.spyOn(jwt, 'verify').mockReturnValue({ userId: 6 });

    verifierToken(req, res, next);

    expect(req.userId).toBe(6);
    expect(next).toHaveBeenCalled();
  });
});
