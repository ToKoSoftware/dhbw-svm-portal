import { Client } from 'basic-ftp';
import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { FileInfo } from 'basic-ftp/dist/FileInfo';
import isBlank from 'is-blank';
import { UploadedFile } from 'express-fileupload';
import tempDirectory from 'temp-dir';
import { loadOrgSetting } from '../../../functions/settings.func';
import { FTPClientConfiguration } from './configure';
import { CustomError } from '../../../middleware/error-handler';
import { PortalErrors } from '../../../enum/errors';

export async function getDocuments(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const client = await getFTPClientForOrg();
        const list = await client.list();
        const listWithoutFolders = mapReturnedFiles(list);
        client.close();
        return res.send(wrapResponse(true, listWithoutFolders));
    } catch (error) {
        next(new CustomError(PortalErrors.FILESERVER_ERROR, 500, error));
    }
}

export async function uploadDocument(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        if (isBlank(req.files) || req.files === undefined || req.files.file == null) {
            throw 'No file uploaded';
        }
        const file: UploadedFile = Array.isArray(req.files.file) ? req.files.file[ 0 ] : req.files.file;
        const splitFileName = file.name.split('.');
        const fileExtension = splitFileName[ splitFileName.length - 1 ];

        // check file extension to prevent some attacks
        // needs to be improved in the future
        const allowedFileExtensions = [ 'csv', 'xls', 'xlsx', 'png', 'jpg', 'pdf', 'doc', 'docx', 'svg', 'zip', 'svg' ];
        if (!allowedFileExtensions.includes(fileExtension.toLowerCase())) {
            throw 'Wrong File Extension, expected one of the following: csv, xls, xlsx, png, jpg, pdf, doc, docx, svg, zip, svg. Got '
            + fileExtension;
        }

        // enforce max size of 20mb per file
        if (file.size / (1024 * 1024) >= 20) {
            throw 'Max file size reached';
        }
        const client = await getFTPClientForOrg();
        await client.uploadFrom(file.tempFilePath, file.name);
        client.close();
        return res.send(wrapResponse(true));
    } catch (error) {
        next(new CustomError(PortalErrors.BAD_REQUEST, 400, error));
    }
}

export async function downloadDocument(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
        const client = await getFTPClientForOrg();
        const fileName = req.params.fileName;
        const tempFilePath = tempDirectory + fileName;
        await client.downloadTo(tempFilePath, fileName);
        client.close();
        return res.sendFile(tempFilePath, {}, (err) => {
            if (err) {
                throw err;
            }
        });
    } catch (error) {
        next(new CustomError(PortalErrors.NOT_FOUND, 404, error));
    }
}

export async function deleteDocument(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
        const client = await getFTPClientForOrg();
        const fileName = req.params.fileName || '';
        await client.remove(fileName);
        return res.send(wrapResponse(true));
    } catch (error) {
        next(new CustomError(PortalErrors.NOT_FOUND, 404, error));
    }
}

function mapReturnedFiles(files: FileInfo[]): Document[] {
    try {
        files = files.filter(file => file.type !== 2);
        return files.map(
            f => {
                return {
                    name: f.name,
                    size: f.size,
                    modifiedAt: f.modifiedAt?.toISOString() || new Date().toISOString()
                };

            }
        );
    } catch (error) {
        throw new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error);
    }
}

async function getFTPClientForOrg(): Promise<Client> {
    try {
        const client = new Client();
        const ftpConfig = await loadOrgSetting<FTPClientConfiguration>('ftp');
        if (!ftpConfig) {
            throw 'Not configured';
        }

        await client.access({
            host: ftpConfig.data.host,
            user: ftpConfig.data.user,
            password: ftpConfig.data.password,
            secure: true
        });
        return client;
    } catch (error) {
        throw new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error);
    }
}

export interface Document {
    name: string;
    size: number;
    modifiedAt: string;
}
