import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@Prisma/client';

export function handlePrismaError(
  error: unknown,
  entityName = 'record',
): Error {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
        return new BadRequestException(
          'Input value is too long for the field.',
        );
      case 'P2001':
        return new NotFoundException(`The ${entityName} was not found.`);
      case 'P2002': {
        const fields = (error.meta?.target as string[]) ?? ['field'];
        return new ConflictException(
          `A ${entityName} with this ${fields.join(', ')} already exists.`,
        );
      }
      case 'P2003':
        return new BadRequestException('Foreign key constraint failed.');
      case 'P2004':
        return new ForbiddenException('Database constraint violated.');
      case 'P2005':
        return new BadRequestException('Invalid value for a field.');
      case 'P2006':
        return new BadRequestException('Invalid field in where clause.');
      case 'P2007':
        return new BadRequestException('Data validation error.');
      case 'P2008':
        return new InternalServerErrorException('Invalid query provided.');
      case 'P2009':
        return new InternalServerErrorException('Query validation failed.');
      case 'P2010':
        return new BadRequestException('Raw query failed. Check your query.');
      case 'P2011':
        return new BadRequestException('Null constraint failed.');
      case 'P2012':
        return new BadRequestException('Missing required value.');
      case 'P2013':
        return new BadRequestException('Missing required argument.');
      case 'P2014':
        return new BadRequestException('Relation violation between records.');
      case 'P2015':
        return new NotFoundException(
          'Record not found for the given condition.',
        );
      case 'P2016':
        return new BadRequestException('Field not found in query path.');
      case 'P2017':
        return new BadRequestException('Records not connected.');
      case 'P2018':
        return new BadRequestException('Incorrect relation field name.');
      case 'P2019':
        return new BadRequestException('Input error in relation conditions.');
      case 'P2020':
        return new BadRequestException('Value out of range.');
      case 'P2021':
        return new BadRequestException('Table does not exist.');
      case 'P2022':
        return new BadRequestException('Column does not exist.');
      case 'P2023':
        return new BadRequestException('Inconsistent query parameters.');
      case 'P2024':
        return new InternalServerErrorException('Query timeout reached.');
      case 'P2025':
        return new NotFoundException(
          `The requested ${entityName} does not exist.`,
        );
      case 'P2026':
        return new BadRequestException(
          'Unsupported feature used in the query.',
        );
      case 'P2027':
        return new InternalServerErrorException('Multiple transaction errors.');
      case 'P2028':
        return new InternalServerErrorException('Query interpretation error.');
      case 'P2030':
        return new ForbiddenException('Blocked by database protection rules.');
      case 'P2031':
        return new InternalServerErrorException('Prisma is misconfigured.');
      case 'P2033':
        return new InternalServerErrorException('Unsupported engine feature.');
      case 'P2034':
        return new ForbiddenException('Insufficient DB permissions.');
      case 'P2035':
        return new UnauthorizedException('Authentication failed.');
      case 'P2036':
        return new InternalServerErrorException('Unexpected server error.');

      default:
        return new InternalServerErrorException(
          `Unexpected Prisma error: ${error.code}`,
        );
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new InternalServerErrorException('Prisma failed to initialize.');
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new InternalServerErrorException('Prisma crashed (Rust panic).');
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestException('Input validation failed.');
  }

  if (error instanceof Error) {
    return new InternalServerErrorException(error.message);
  }

  return new InternalServerErrorException('An unknown error occurred.');
}
