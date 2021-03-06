import * as Yup from 'yup';

import { Schemas } from '../../generated/OpenapiIntegrations';
import {
    IntegrationCamel,
    IntegrationHttp,
    IntegrationType, NewIntegration,
    NewIntegrationBase, NewIntegrationTemplate
} from '../../types/Integration';

export const maxIntegrationNameLength = 150;

export const IntegrationSchemaBase = Yup.object<NewIntegrationBase>({
    name: Yup.string().required('Write a name for this Integration.').max(maxIntegrationNameLength).trim(),
    type: Yup.mixed<IntegrationType>().oneOf([ IntegrationType.WEBHOOK, IntegrationType.CAMEL ]).default(IntegrationType.WEBHOOK),
    isEnabled: Yup.boolean().default(true).required()
});

export const IntegrationHttpSchema = IntegrationSchemaBase.concat(Yup.object<NewIntegrationTemplate<IntegrationHttp>>().shape({
    type: Yup.mixed<IntegrationType.WEBHOOK>().oneOf([ IntegrationType.WEBHOOK ]).required(),
    url: Yup.string().url().required('Write a valid url for this Integration.'),
    sslVerificationEnabled: Yup.boolean().default(true),
    secretToken: Yup.string().notRequired(),
    method: Yup.mixed<Schemas.HttpType>().oneOf(Object.values(Schemas.HttpType.Enum)).default(Schemas.HttpType.Enum.POST)
}));

export const IntegrationCamelSchema = IntegrationSchemaBase.concat(Yup.object<NewIntegrationTemplate<IntegrationCamel>>().shape({
    type: Yup.mixed<IntegrationType.CAMEL>().oneOf([ IntegrationType.CAMEL ]).required(),
    url: Yup.string().required('Provide a url/host for this Integration.'),
    sslVerificationEnabled: Yup.boolean().default(true),
    secretToken: Yup.string().notRequired()
}));

export const IntegrationSchema = Yup.lazy<NewIntegration | NewIntegrationBase | undefined>(value => {
    if (value) {
        if (value.type === IntegrationType.WEBHOOK) {
            return IntegrationHttpSchema;
        }

        if (value.type === IntegrationType.CAMEL) {
            return IntegrationCamelSchema;
        }
    }

    return IntegrationSchemaBase;
});
