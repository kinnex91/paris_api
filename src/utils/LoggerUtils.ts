// src/utils/LoggerUtils.ts

export class LoggerUtils {
    /**
     * Retourne le nom complet de la méthode au format "ClassName.methodName".
     * @param context Le contexte de la classe (this).
     * @param method La méthode dont on veut le nom.
     * @returns Le nom complet au format "ClassName.methodName".
     */
    static getCurrentMethodName(context: any, method: Function): string {
        const className = context.constructor.name || 'UnknownClass';
        const methodName = method.name || 'UnknownMethod';
        return `${className}.${methodName}`;
    }
}
