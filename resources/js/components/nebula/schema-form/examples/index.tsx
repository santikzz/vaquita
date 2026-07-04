import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { InputSection } from "./sections/input-section";
import { PasswordSection } from "./sections/password-section";
import { TextareaSection } from "./sections/textarea-section";
import { CurrencySection } from "./sections/currency-section";
import { DateSection } from "./sections/date-section";
import { SelectSection } from "./sections/select-section";
import { SelectApiSection } from "./sections/select-api-section";
import { ToggleSection } from "./sections/toggle-section";
import { RadioSection } from "./sections/radio-section";
import { FileSection } from "./sections/file-section";
import { PhoneSection } from "./sections/phone-section";
import { OtpSection } from "./sections/otp-section";
import { TagsSection } from "./sections/tags-section";
import { SliderSection } from "./sections/slider-section";
import { CustomSection } from "./sections/custom-section";
import { BehaviorSection } from "./sections/behavior-section";
import { ThemeToggle } from "@/components/theme-toggle";

// ─── Sidebar navigation items ────────────────────────────────────────────────

const NAV = [
    { id: "inputs", label: "Input" },
    { id: "password", label: "Password" },
    { id: "textarea", label: "Textarea" },
    { id: "currency", label: "Currency" },
    { id: "date", label: "Date" },
    { id: "tags", label: "Tags" },
    { id: "select", label: "Select" },
    { id: "select-api", label: "Select API" },
    { id: "toggles", label: "Switch & Checkbox" },
    { id: "radio", label: "Radio" },
    { id: "file", label: "File" },
    { id: "phone", label: "Phone" },
    { id: "otp", label: "OTP" },
    { id: "slider", label: "Slider" },
    { id: "custom", label: "Custom" },
    { id: "behavior", label: "Behaviors" },
];

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ id, title, subtitle, children }: {
    id: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-8 flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            </div>
            {children}
        </section>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchemaFormGallery() {
    return (
        <div className="flex min-h-screen bg-background">

            {/* ── Sidebar ── */}
            <aside className="hidden lg:flex flex-col sticky top-0 h-screen w-52 shrink-0 border-r border-border/60 bg-muted/10 py-8 px-4 overflow-y-auto">
                <div className="mb-6 px-2 flex justify-between items-center">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                            SchemaForm
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">Component gallery</p>
                    </div>
                    <ThemeToggle />
                </div>
                <nav className="flex flex-col gap-0.5">
                    {NAV.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* ── Content ── */}
            <main className="flex-1 max-w-4xl mx-auto px-6 py-10 flex flex-col gap-14">

                {/* Header */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">SchemaForm</h1>
                        <Badge variant="secondary" className="font-mono text-xs">v1.1.0</Badge>
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
                        Schema-driven forms built on{" "}
                        <span className="text-foreground font-medium">React Hook Form</span> +{" "}
                        <span className="text-foreground font-medium">Zod</span> +{" "}
                        <span className="text-foreground font-medium">shadcn/ui</span>.
                        Define fields once as a typed config - labels, validation, layout, and
                        submit handling are handled automatically.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                       <span>Created by Santiago Bugnón (<a className="underline" href="https://nebulasolutions.com.ar">Nebula Solutions</a>)</span>
                    </div>
                </div>

                <Separator />

                {/* ── Sections ── */}

                <Section id="inputs" title="Input" subtitle="Text, number, email, URL - with leading icons, text prefix, and trailing suffix.">
                    <InputSection />
                </Section>

                <Separator />

                <Section id="password" title="Password" subtitle="Show/hide toggle. Optional strength meter with requirement checklist.">
                    <PasswordSection />
                </Section>

                <Separator />

                <Section id="textarea" title="Textarea" subtitle="Multi-line text with configurable row height.">
                    <TextareaSection />
                </Section>

                <Separator />

                <Section id="currency" title="Currency" subtitle="Numeric input with leading currency symbol and trailing ISO code. Normalises to float on blur.">
                    <CurrencySection />
                </Section>

                <Separator />

                <Section id="date" title="Date picker" subtitle="Calendar popover with month/year dropdowns. Localized via i18n. Stores ISO strings by default.">
                    <DateSection />
                </Section>

                <Separator />

                <Section id="tags" title="Tags input" subtitle="Free-form tag entry or searchable autocomplete from a fixed options list.">
                    <TagsSection />
                </Section>

                <Separator />

                <Section id="select" title="Select" subtitle="Plain dropdown or searchable combobox from a static options list.">
                    <SelectSection />
                </Section>

                <Separator />

                <Section id="select-api" title="Select API" subtitle="Fetches options from an endpoint with debounced live search and AbortController.">
                    <SelectApiSection />
                </Section>

                <Separator />

                <Section id="toggles" title="Switch & Checkbox" subtitle="Horizontal card layout - label on the left, control on the right.">
                    <ToggleSection />
                </Section>

                <Separator />

                <Section id="radio" title="Radio" subtitle="Single-select options. Default list, horizontal, plan cards, or icon cards.">
                    <RadioSection />
                </Section>

                <Separator />

                <Section id="file" title="File upload" subtitle="Dashed upload zone with image preview. Supports edit-mode URL defaultValues.">
                    <FileSection />
                </Section>

                <Separator />

                <Section id="phone" title="Phone" subtitle="Country flag selector + E.164 formatted input.">
                    <PhoneSection />
                </Section>

                <Separator />

                <Section id="otp" title="OTP" subtitle="One-time-password / PIN input. Two groups separated by a dash.">
                    <OtpSection />
                </Section>

                <Separator />

                <Section id="slider" title="Slider" subtitle="Range slider with optional live value display.">
                    <SliderSection />
                </Section>

                <Separator />

                <Section id="custom" title="Custom field" subtitle="Full escape hatch for any component - tag inputs, colour pickers, rich text, etc.">
                    <CustomSection />
                </Section>

                <Separator />

                <Section id="behavior" title="Behaviors" subtitle="onlySubmitIfDirty, onlySubmitIfValid, and conditional field visibility.">
                    <BehaviorSection />
                </Section>

                <div className="pb-12" />
            </main>
        </div>
    );
}
