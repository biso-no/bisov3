'use server'
import { createSessionClient } from "@/lib/appwrite";
import { ID, Models, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductStatus } from "../(admin)/admin/shop/products/_components/edit-product";
import { Department } from "@/lib/types/post";

const databaseId = 'app';
const collectionId = 'webshop_products';





export async function getProducts(status: string = 'all') {
    const { db } = await createSessionClient();
    try {
        let queries = [Query.limit(100)];
        if (status !== 'all') {
            queries.push(Query.equal('status', status));
        }

        const response = await db.listDocuments(
            databaseId,
            collectionId,
            queries
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export async function getProductBySlug(slug: string) {
    const { db } = await createSessionClient();
    try {
        const response = await db.listDocuments(
            databaseId,
            collectionId,
            [Query.equal('slug', slug), Query.limit(1)]
        );
        return response.documents[0] || null;
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        return null;
    }
}

export async function updateProductStatus(productId: string, newStatus: ProductStatus) {
    const { db } = await createSessionClient();
    try {
        await db.updateDocument(
            databaseId,
            collectionId,
            productId,
            { status: newStatus }
        );
        revalidatePath('/admin/shop/products');
        return { success: true };
    } catch (error) {
        console.error('Error updating product status:', error);
        return { success: false, error: 'Failed to update product status' };
    }
}

export async function deleteProduct(productId: string) {
    const { db } = await createSessionClient();
    try {
        await db.deleteDocument(
            databaseId,
            collectionId,
            productId
        );
        revalidatePath('/admin/shop/products');
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: 'Failed to delete product' };
    }
}

export async function createProduct(formData: FormData) {
    const productData = Object.fromEntries(formData) as Record<string, FormDataEntryValue>;

    const { db } = await createSessionClient();

    const transformedData: any = {
        description: productData.description as string,
        slug: productData.slug as string,
        url: productData.url as string,
        type: productData.type as string,
        status: productData.status as string,
        campus_id: productData.campus_id as string,
        department_id: productData.department_id as string,
        campus: productData.campus_id as string,
        department: productData.department_id as string,
        images: (productData.images as string).split(',').map(image => image.trim()),  // Handling multiple images
        price: parseFloat(productData.price as string),
        sale_price: parseFloat(productData.sale_price as string),
        manage_stock: productData.manage_stock === 'true',
        sold_individually: productData.sold_individually === 'true',
        featured: productData.featured === 'true',
        on_sale: productData.on_sale === 'true',
        tags: (productData.tags as string).split(',').map(tag => tag.trim()),
    };

    // Create the product in the database
    const product = await db.createDocument(
        'app',              // Your database ID
        'webshop_products',         // Your collection ID
        ID.unique(),        // Unique ID for the document
        transformedData     // The transformed data object
    );

    return product;
}


export async function updateProduct(productId: string, formData: FormData) {
    // Convert formData into an object
    const productData = Object.fromEntries(formData) as Record<string, FormDataEntryValue>;
    
    // Create a new object to store the transformed product data
    const transformedData: any = {
        description: productData.description as string,
        slug: productData.slug as string,
        url: productData.url as string,
        type: productData.type as string,
        status: productData.status as string,
        campus_id: productData.campus_id as string,
        department_id: productData.department_id as string,
        campus: productData.campus_id as string,
        department: productData.department_id as string,
        images: (productData.images as string).split(',').map(image => image.trim()),  // Handling multiple images
        price: parseFloat(productData.price as string),
        sale_price: parseFloat(productData.sale_price as string),
        manage_stock: productData.manage_stock === 'true',
        sold_individually: productData.sold_individually === 'true',
        featured: productData.featured === 'true',
        on_sale: productData.on_sale === 'true',
        tags: (productData.tags as string).split(',').map(tag => tag.trim()),
    };
    
    const { db } = await createSessionClient();
    
    // Update the product in the database
    const product = await db.updateDocument(
        'app',              // Your database ID
        'webshop_products',         // Your collection ID
        productId,          // The unique ID of the document
        transformedData     // The transformed data object
    );

    return product;
}

export async function uploadImage(file: File) {
    const { storage } = await createSessionClient();
    const uploadedFile = await storage.createFile(
        'YOUR_BUCKET_ID',
        'unique()',
        file
    );

    return storage.getFileView('YOUR_BUCKET_ID', uploadedFile.$id);
}

export async function getCampuses() {
    const { db } = await createSessionClient();
    const campuses = await db.listDocuments(
        'app',
        'campus',
        [Query.select(['name', '$id'])]
    );

    return campuses.documents;
}

export async function getDepartments(campus?: string, limit?: number) {
    const { db } = await createSessionClient();

    let query = [Query.select(['Name', '$id', 'campus_id'])];
    if (campus) {
        query.push(Query.equal('campus_id', campus));
    } 
    if (limit) {
        query.push(Query.limit(limit));
    }

    const departments = await db.listDocuments(
        'app',
        'departments',
        query
    );

    return departments.documents as Department[];
}