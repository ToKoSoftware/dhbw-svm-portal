import {Request, Response} from 'express';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/check-inputs.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {OrganizationDataSnapshot, RawOrganizationData} from '../../../interfaces/organization.interface';
import {Organization} from '../../../models/organization.model';
import {mapOrg} from '../../../functions/map-org.func';
import {Role} from '../../../models/role.model';
import {Model} from 'sequelize-typescript';

export async function createOrganization(req: Request, res: Response): Promise<Response> {
    const incomingData: OrganizationDataSnapshot = req.body;
    const mappedIncomingData: RawOrganizationData = mapOrg(incomingData, 'pending');

    const requiredFields = Organization.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return handleError(res, 400, 'Fields must not be empty', [null]);
    }
    const createdOrg = await Organization.create(mappedIncomingData).catch((data) => null);
    if (!createdOrg) {
        return handleError(res, 500, 'Organization could not be created', [null]);
    }
    // create a new admin role
    const createdRole = await Role.create({title: 'Administratoren', user_deletable: false, org_id: createdOrg.id}).catch(() => null);
    if (!createdRole) {
        return handleError(res, 500, 'Role could not be created', [createdOrg]);
    }
    createdOrg.admin_role_id = createdRole.id;
    const updateSuccess = createdOrg.save().then(() => true).catch(() => false);
    if (!updateSuccess) {
        return handleError(res, 400, 'Organization could not be created', [createdRole, createdOrg]);
    }
    // todo create more demo data models
    return res.send(wrapResponse(true, createdOrg));
}

function handleError(res: Response, code: number, reason: string, dataToDelete: Array<Model | null>): Response {
    // clean up
    dataToDelete.forEach(model => model?.destroy());
    return res.status(code).send(wrapResponse(false, {error: reason}));
}
