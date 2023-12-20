// user service which is handle bussiness loggic

import { plainToClass } from "class-transformer";
import { UserRepository } from "../repository/userRepository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidationError } from "../utility/errors";
import {
  GetSalt,
  GetHashedPassword,
  ValidatePassword,
  GetToken,
  VerifyToken,
} from "../utility/password";
import { LoginInput } from "../models/dto/LoginInput";
import {
  GenerateAccessCode,
  SendVerificationCode,
} from "../utility/notification";
import { VerificationInput } from "../models/dto/UpdateInput";
import { TimeDifference } from "../utility/dateHelper";
import { ProfileInput } from "../models/dto/AddressInput";

@autoInjectable()
export class UserService {
  repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(404, "requested method is not supported!");
  }

  // User Creation ,Validation && Login
  async CreateUser(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(SignupInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);
      // await this.repository.CreateUserOperation();
      const salt = await GetSalt();
      const hashedPassword = await GetHashedPassword(input.password, salt);
      const data = await this.repository.createAccount({
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        userType: "BUYER",
        salt: salt,
      });
      const token = GetToken(data);

      return SuccessResponse({
        token,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        userType: data.userType,
        _id: data.user_id,
      });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }
  async UserLogin(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(LoginInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);
      const data = await this.repository.findAccount(input.email);
      const verified = await ValidatePassword(
        input.password,
        data.password,
        data.salt
      );
      if (!verified) {
        throw new Error("Password does not match!");
      }
      // check or validate password
      const token = GetToken(data);
      return SuccessResponse({
        token,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        userType: data.userType,
        _id: data.user_id,
      });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async GetVerificationToken(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const { code, expiry } = GenerateAccessCode();
      //save on DB to confirm verification
      await this.repository.updateVerificationCode(
        payload.user_id,
        code,
        expiry
      );
      await SendVerificationCode(code, payload.phone);
      return SuccessResponse({
        message: "Verification code is sent to your registered mobile number",
      });
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed");

      const input = plainToClass(VerificationInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const { verification_code, expiry } = await this.repository.findAccount(
        payload.email
      );
      // find the user account
      if (verification_code === parseInt(input.code)) {
        //check expiry
        const currentTime = new Date();
        const diff = TimeDifference(expiry, currentTime.toISOString(), "m");
        if (diff > 0) {
          await this.repository.updateVerifyUser(payload.user_id);
        }
      } else {
        return ErrorResponse(403, "verification code is expired!");
      }
      // check the code is same or not and time should within expiry
      return SuccessResponse({ message: "user verified!" });
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  // User profile

  async CreateProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "Authorization Failed");

      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const result = await this.repository.createProfile(
        payload.user_id,
        input
      );
      return SuccessResponse({ message: "profile created!" });
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async GetProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");
      const result = await this.repository.getUserProfile(payload.user_id);
      return SuccessResponse(result);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }
  async EditProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(404, "authorization failed!");

      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      await this.repository.editProfile(payload.user_id, input);
      return SuccessResponse({ message: "profile updated!" });
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  // Payment Section

  async CreatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response Create Payment Method" });
  }
  async GetPaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response Get Payment Method" });
  }
  async UpdatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({
      message: "response Create Update Payment Method",
    });
  }
}
