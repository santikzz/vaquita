import { z } from "zod";
import { SchemaForm } from "../../index";
import { ExampleBlock } from "../example-block";
import { PropsTable } from "../props-table";

function onSubmit(data: unknown) {
    // Files are not JSON-serialisable - show names instead
    const preview: Record<string, unknown> = {};
    const d = data as Record<string, unknown>;
    for (const [k, v] of Object.entries(d)) {
        if (v instanceof File) preview[k] = v.name;
        else if (Array.isArray(v)) preview[k] = v.map((f) => (f instanceof File ? f.name : f));
        else preview[k] = v;
    }
    alert(JSON.stringify(preview, null, 2));
}

export function FileSection() {
    return (
        <div className="flex flex-col gap-6">
            <ExampleBlock
                title="File - single image with preview"
                badge="file"
                description="Upload zone. When a file is selected it shows a thumbnail preview, filename, and size. Passing a URL string in defaultValues shows the existing image (edit mode)."
                code={SINGLE_CODE}
            >
                <SchemaForm
                    schema={z.object({
                        thumbnail: z.instanceof(File, { message: "Upload an image" }),
                    })}
                    fields={[
                        {
                            name: "thumbnail",
                            component: "file",
                            label: "Thumbnail",
                            accept: "image/*",
                            preview: true,
                            maxSizeMb: 5,
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Upload"
                    layout="stack"
                />
            </ExampleBlock>

            <ExampleBlock
                title="File - non-image with no preview"
                badge="file · no preview"
                description="Same component, preview: false. Shows a generic file icon instead of a thumbnail."
                code={NON_IMAGE_CODE}
            >
                <SchemaForm
                    schema={z.object({
                        stl_file: z.instanceof(File, { message: "Upload a .stl or .zip file" }),
                    })}
                    fields={[
                        {
                            name: "stl_file",
                            component: "file",
                            label: "STL / ZIP file",
                            accept: ".stl,.zip",
                            preview: false,
                            maxSizeMb: 50,
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Upload"
                    layout="stack"
                />
            </ExampleBlock>

            <ExampleBlock
                title="File - edit mode (existing URL)"
                badge="file · defaultValues"
                description="Pass a URL string in defaultValues to show the current file. The user can replace it by clicking the × and re-uploading."
                code={EDIT_MODE_CODE}
            >
                <SchemaForm
                    schema={z.object({
                        avatar: z.union([z.instanceof(File), z.string()]).optional(),
                    })}
                    defaultValues={{
                        avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=nebula",
                    }}
                    fields={[
                        {
                            name: "avatar",
                            component: "file",
                            label: "Avatar",
                            accept: "image/*",
                            preview: true,
                            maxSizeMb: 2,
                        },
                    ]}
                    onSubmit={onSubmit}
                    submitLabel="Save"
                    layout="stack"
                />
            </ExampleBlock>
            <PropsTable
                title="FileFieldConfig props"
                rows={[
                    { name: "component", type: '"file"', description: "Field type discriminator" },
                    { name: "accept", type: "string", description: 'HTML accept attribute (e.g. "image/*", ".stl,.zip")' },
                    { name: "multiple", type: "boolean", default: "false", description: "Allow multiple file selection" },
                    { name: "preview", type: "boolean", default: "true", description: "Show image thumbnail preview" },
                    { name: "maxSizeMb", type: "number", description: "Max file size in MB (enforced client-side)" },
                    { name: "inputClassName", type: "string", description: "CSS classes on the upload zone container" },
                ]}
            />
        </div>
    );
}

const SINGLE_CODE = `\
const schema = z.object({
    thumbnail: z.instanceof(File, { message: "Upload an image" }),
});

<SchemaForm
    schema={schema}
    fields={[
        { name: "thumbnail", component: "file", label: "Thumbnail",
          accept: "image/*", preview: true, maxSizeMb: 5 },
    ]}
    onSubmit={(data) => {
        const fd = new FormData();
        fd.append("thumbnail", data.thumbnail);
        router.post(route("products.store"), fd, { forceFormData: true });
    }}
/>`;

const NON_IMAGE_CODE = `\
{ name: "stl_file", component: "file", label: "STL / ZIP file",
  accept: ".stl,.zip", preview: false, maxSizeMb: 50 }`;

const EDIT_MODE_CODE = `\
// Edit mode - pass the existing URL as defaultValues.
// If the user doesn't replace it, the string is submitted as-is.
// If they upload a new file, a File object is submitted instead.
<SchemaForm
    schema={z.object({ avatar: z.union([z.instanceof(File), z.string()]).optional() })}
    defaultValues={{ avatar: "https://cdn.example.com/avatars/user-1.jpg" }}
    fields={[
        { name: "avatar", component: "file", label: "Avatar", accept: "image/*", preview: true },
    ]}
    onSubmit={(data) => {
        if (data.avatar instanceof File) {
            // new file - use FormData
        } else {
            // unchanged string - submit as JSON
        }
    }}
/>`;
