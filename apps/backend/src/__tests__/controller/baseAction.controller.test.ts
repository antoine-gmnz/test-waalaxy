import { getAllBaseActionController } from '../../controller/baseAction.controller';
import { getAllBaseAction } from '../../service/baseAction.service';
import { HttpStatusCode } from 'axios';
import { TypedRequest } from '../../typings';
import { Response } from 'express';

jest.mock('../../service/baseAction.service');

describe('getAllBaseActionController', () => {
  let req: TypedRequest<undefined>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {} as TypedRequest<undefined>;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it('should return all base actions with a 200 status code', async () => {
    const mockBaseActions = [
      { id: '1', name: 'Action 1', maxCredits: 100 },
      { id: '2', name: 'Action 2', maxCredits: 80 },
    ];
    (getAllBaseAction as jest.Mock).mockResolvedValue(mockBaseActions);

    await getAllBaseActionController(req, res as Response);

    expect(getAllBaseAction).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(res.send).toHaveBeenCalledWith(mockBaseActions);
  });

  it('should return a 500 status code if there is an error', async () => {
    const error = new Error('Service error');
    (getAllBaseAction as jest.Mock).mockRejectedValue(error);

    await getAllBaseActionController(req, res as Response);

    expect(getAllBaseAction).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(res.send).toHaveBeenCalledWith(error);
  });
});
