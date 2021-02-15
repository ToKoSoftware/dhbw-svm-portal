import {Client} from 'basic-ftp';
import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {FileInfo} from 'basic-ftp/dist/FileInfo';
import isBlank from 'is-blank';
import {UploadedFile} from 'express-fileupload';
import tempDirectory from 'temp-dir';
import {loadOrgSetting} from '../../../functions/settings.func';
import {OAuth2ClientConfiguration} from '../../oauth2/authenticate';
import {FTPClientConfiguration} from './configure';

export async function getDocuments(req: Request, res: Response): Promise<Response> {
    try {
        const client = await getFTPClientForOrg();
        const list = await client.list();
        const listWithoutFolders = mapReturnedFiles(list);
        client.close();
        return res.send(wrapResponse(true, listWithoutFolders));
    } catch (err) {
        return res.status(500).send(wrapResponse(false, {error: 'Fileserver error', message: err}));
    }
}

export async function uploadDocument(req: Request, res: Response): Promise<Response> {
    try {
        if (isBlank(req.files) || req.files === undefined || req.files.file == null) {
            throw 'No file uploaded';
        }
        const file: UploadedFile = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
        const splitFileName = file.name.split('.');
        const fileExtension = splitFileName[splitFileName.length - 1];

        // check file extension to prevent some attacks
        // needs to be improved in the future
        const allowedFileExtensions = ['csv', 'xls', 'xlsx', 'png', 'jpg', 'pdf', 'doc', 'docx', 'svg', 'zip', 'svg'];
        if (!allowedFileExtensions.includes(fileExtension.toLowerCase())) {
            throw 'Wrong File Extension, expected csv - got ' + fileExtension;
        }

        // enforce max size of 20mb per file
        if (file.size / (1024 * 1024) >= 20) {
            throw 'Max file size reached';
        }
        const client = await getFTPClientForOrg();
        await client.uploadFrom(file.tempFilePath, file.name);
        client.close();
        return res.send(wrapResponse(true));
    } catch (e) {
        return res.status(400).send(wrapResponse(false, {error: e}));
    }
}

export async function downloadDocument(req: Request, res: Response): Promise<void | Response> {
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
    } catch (e) {
        return res.status(404).send(wrapResponse(false, {error: e}));
    }
}

export async function deleteDocument(req: Request, res: Response): Promise<void | Response> {
    try {
        const client = await getFTPClientForOrg();
        const fileName = req.params.fileName || '';
        await client.remove(fileName);
        return res.send(wrapResponse(true));
    } catch (e) {
        return res.status(404).send(wrapResponse(false, {error: e}));
    }
}

function mapReturnedFiles(files: FileInfo[]): Document[] {
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
}

async function getFTPClientForOrg(): Promise<Client> {
    const client = new Client();
    client.ftp.verbose = true;
    const ftpConfig = await loadOrgSetting<FTPClientConfiguration>('ftp');
    if (!ftpConfig) {
        throw 'Not configured';
    }

    await client.access({
        host: ftpConfig.data.domain,
        user: ftpConfig.data.user,
        password: ftpConfig.data.password,
        secure: true
    });
    return client;
}

export interface Document {
    name: string;
    size: number;
    modifiedAt: string;
}
