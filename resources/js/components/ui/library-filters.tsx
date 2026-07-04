import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { FiltersDropdown } from '@/components/ui/filters-dropdown';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { ChevronDown } from "lucide-react";

const types = ['Manga', 'Light Novel', 'One-shot'];
const statuses = ['In progress', 'Complete'];
const genres = ["Martial Art", "Action", "Romance", "Comedy", "Science-fiction", "Isekai", "Slice of life"];

export default function LibraryFilters() {
    
    const { t } = useTranslation();

    return (
        <div className="flex flex-row md:flex-row gap-y-4 gap-x-[11px] md:gap-x-[23px] w-full">
            <div className="flex flex-col gap-1 flex-1">
                <span className="text-sm font-semibold text-muted-foreground">{t('filters.genre')}</span>
                <FiltersDropdown options={genres}/>
            </div>
            <div className="flex flex-col gap-1 flex-1">
                <span className="text-sm font-semibold text-muted-foreground">{t('filters.type')}</span>
                <FiltersDropdown options={types}/>
            </div>
            <div className="flex flex-col gap-1 flex-1">
                <span className="text-sm font-semibold text-muted-foreground">{t('filters.status')}</span>
                <FiltersDropdown options={statuses}/>
            </div>
        </div>
    );
}