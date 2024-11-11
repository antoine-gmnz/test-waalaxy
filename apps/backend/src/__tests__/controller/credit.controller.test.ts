import { updateCreditForBaseAction } from '../../controller/credit.controller';
import { updateCreditForAction } from '../../service/credit.service';
import { TypedRequest, UpdateCreditRequestType } from '../../typings';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';

jest.mock('../../service/credit.service');

describe('updateCreditForBaseAction', () => {
  let req: TypedRequest<UpdateCreditRequestType>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: { creditId: '123', newCreditNumber: 50 },
    } as TypedRequest<UpdateCreditRequestType>;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  it('should update the credit and return the updated credit with a 200 status', async () => {
    const mockCredit = { id: '123', creditNumber: 50 };
    (updateCreditForAction as jest.Mock).mockResolvedValue(mockCredit);

    await updateCreditForBaseAction(req, res as Response);

    expect(updateCreditForAction).toHaveBeenCalledWith(50, '123');
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(res.json).toHaveBeenCalledWith(mockCredit);
  });

  it('should send an internal server error message if updateCreditForAction returns null', async () => {
    (updateCreditForAction as jest.Mock).mockResolvedValue(null);

    await updateCreditForBaseAction(req, res as Response);

    expect(updateCreditForAction).toHaveBeenCalledWith(50, '123');
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });

  it('should return a 500 status and send error if an exception occurs', async () => {
    const error = new Error('Service error');
    (updateCreditForAction as jest.Mock).mockRejectedValue(error);

    await updateCreditForBaseAction(req, res as Response);

    expect(updateCreditForAction).toHaveBeenCalledWith(50, '123');
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(res.send).toHaveBeenCalledWith(error);
  });
});
