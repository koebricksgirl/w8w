import prisma from "@w8w/db";

export async function createOrUseForm(node: any, workflowId?: string) {
    if (!workflowId) throw new Error("workflowId required for form node");
    if (!node) throw new Error("Node required but no node provided");

    try {
        const form = await prisma.form.findUnique({
            where: { workflowId_nodeId: { workflowId, nodeId: node.id } }
        });

        if (!form) throw new Error("Form not found for this workflow node");

        return { formId: form.id, url: `/forms/${form.id}` }
    } catch (error: any) {
        console.error(error.message)
        throw new Error("Some error has happened on form Node Runner");
    }

}