const columnRegistry: { [key: string]: { [key: string]: ColumnParams } } = {};
const collectionRegistry: { [key: string]: string } = {};
const nameWiseClassMap: { [key: string]: string } = {};
const collectionWiseNameFieldMap: { [key: string]: { [key: string]: string } } = {};

export interface ClassType<T = any> {
    new(...args: any[]): T;
}

export const isNull = (data: any): boolean => data === null || data === undefined;

export type Document = { [key: string]: any };

interface ColumnParams {
    returnType: Function;
    defaultValue?: Function;
    name?: string;
}

/*interface UniqueParams {
    name: string;
    errorMsg?: (value: any) => string;
}*/

export const Collection = (name?: string) => {
    return (constructor: Function) => {
        name = name ? name : constructor.name;
        if (nameWiseClassMap[name]) {
            throw new Error(`Name ${name} used for Class ${constructor.name} already associated with ${nameWiseClassMap[name]}.`);
        }
        collectionRegistry[constructor.name] = name;
        nameWiseClassMap[name] = constructor.name;
    }
}

export const Column = (params: ColumnParams): Function => {
    return (target: any, propertyKey: string) => {
        if (params.name && !params.name.trim()) {
            throw new Error(`Invalid name for field ${propertyKey} in class ${target.name}.`);
        }
        if (!columnRegistry[target.constructor.name]) {
            columnRegistry[target.constructor.name] = {};
        }
        if (!collectionWiseNameFieldMap[target.constructor.name]) {
            collectionWiseNameFieldMap[target.constructor.name] = {};
        }
        if (collectionWiseNameFieldMap[target.constructor.name][params.name || propertyKey]) {
            throw new Error(`Duplicate name ${params.name || propertyKey} in class ${target.name}.`)
        }
        columnRegistry[target.constructor.name][propertyKey] = params;
        collectionWiseNameFieldMap[target.constructor.name][params.name || propertyKey] = propertyKey;
    }
}

/*export const Unique = (params: UniqueParams): Function => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    }
}*/

export const getCollectionName = (classType: ClassType): string => collectionRegistry[classType.name];

export const createMongoIndexes = () => {

}

export const getDocument = <T>(classType: ClassType<T>, data: Document = {}): T => {
    return getDocumentValue(classType, data);
};

const getDocumentValue = <T>(classType: ClassType<T>, data?: Document): any => {
    const column = columnRegistry[classType.name];
    if (!column) {
        throw new Error(`Invalid type ${classType.name}.`);
    }
    const documentValue: Document = {};

    Object.keys(column).forEach(fieldName => {
        const fieldDetails = column[fieldName];
        if (fieldDetails) {
            const dataFieldValue = data ? data[fieldName] : null;
            const fieldReturnType = fieldDetails.returnType();
            const customName = fieldDetails.name;
            let defaultValue;
            if (fieldDetails.defaultValue) {
                defaultValue = fieldDetails.defaultValue();
            }
            // if field is of type Array.
            if (Array.isArray(fieldReturnType)) {
                //if dataField value is null check for default value.
                if (isNull(dataFieldValue) && defaultValue) {
                    if (!Array.isArray(defaultValue)) {
                        throw new Error(`${dataFieldValue} is not an Array.`);
                    }
                }
                //if dataField value is not null.
                else if (!isNull(dataFieldValue) && !Array.isArray(dataFieldValue)) {
                    throw new Error(`${dataFieldValue} is not an Array.`);
                }
                const dataType: ClassType = fieldReturnType[0];
                if (!dataType) {
                    throw new Error(`Type missing for field ${fieldName} in class ${classType.name}.`)
                }
                documentValue[customName || fieldName] = [];

                if (!isNull(dataFieldValue)) {
                    if (!collectionRegistry[dataType.name]) {
                        documentValue[customName || fieldName] = dataFieldValue;
                        data![fieldName] = dataFieldValue;
                    }else {
                        const value = dataFieldValue.map((rec: Document) => getDocumentValue(dataType, rec));
                        documentValue[customName || fieldName] = value;
                        data![fieldName] = value;
                    }
                } else if (defaultValue) {
                    const value = defaultValue.map((rec: Document) => getDocumentValue(dataType, rec));
                    documentValue[customName || fieldName] = value;
                    data![fieldName] = value;
                }
            } else {
                if (columnRegistry[(fieldReturnType as ClassType).name]) {
                    if (!isNull(dataFieldValue)) {
                        const value = getDocumentValue(fieldReturnType, dataFieldValue);
                        documentValue[customName || fieldName] = value;
                        data![fieldName] = value;
                    } else if (defaultValue) {
                        const value = getDocumentValue(fieldReturnType, defaultValue);
                        documentValue[customName || fieldName] = value;
                        data![fieldName] = value;
                    }
                } else {
                    if (!isNull(dataFieldValue)) {
                        documentValue[customName || fieldName] = dataFieldValue;
                    } else if (defaultValue) {
                        documentValue[customName || fieldName] = defaultValue;
                        data![fieldName] = defaultValue;
                    }
                }
            }
        }
    });
    return documentValue;
};
