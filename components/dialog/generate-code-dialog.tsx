import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingSpinner } from '../LoadingSpinner';
import FormFieldWrapper from '../FormFieldWrapper';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import FinishedGeneratedCode from './finished-generated-code-dialog';
import { codeProvince, codeRegion, codeType } from '@/app/(app)/admin/generate-code/(datas)/data';
import { GenerateCodeSchema } from '@/schemas/forms/generatecode';

interface GenerateCodeDialogProps {
    open: boolean;
    close: () => void;
}


function GenerateCodeDialog({ open, close }: GenerateCodeDialogProps) {
    const [loading, setLoading] = useState(false); // Initialize loading state
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [finishedGenerate, setFinishedGenerate] = useState<boolean>(false)
    const [GeneratedCode, setGeneratedCode] = useState<string>('')
    const [subProjectTitle, setSubProjectTitle] = useState<string>('')
    const [subProjectInformations, setSubProjectInformations]=useState<object>({})
    const form = useForm<z.infer<typeof GenerateCodeSchema>>({
        resolver: zodResolver(GenerateCodeSchema),
        defaultValues: {
            subprojectTitle:'',
            component: '',
            optionalEntrepSharedInfra: '',
            region: '',
            province: '',
            adLocation: '',
            type: '',
            sequentialNumber: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof GenerateCodeSchema>) => {

        values.sequentialNumber = '0001'
        const code = "MIADP-" + 
        values.component + "-" + 
        values.region + "-" + 
        values.province + "-AD-" + 
        values.adLocation + "-" + 
        values.type + "-" + 
        values.sequentialNumber

        setGeneratedCode(code)
        setSubProjectTitle(values.subprojectTitle)
        setSubProjectInformations(values)
        setFinishedGenerate(true)
    }
    const selectedRegion = form.watch('region');
    const filteredProvinces = codeProvince.filter(province => province.region === selectedRegion);

    const selectedType = form.watch('component');
    const filteredType = codeType.filter(type => type.type === selectedType);
    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[30%] overflow-y-auto scrollbar-thin max-h-[95vh] ">
                    <DialogHeader>
                        <DialogTitle>Generate Sub Project Code</DialogTitle>
                        <DialogDescription>
                            *Please make sure all the details are correct before generating!
                        </DialogDescription>

                    </DialogHeader>
                    <Form  {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                            autoComplete="off" >
                            <div className="space-y-4">
                            <FormFieldWrapper
                                    control={form.control}
                                    name="subprojectTitle"
                                    label="Subproject Title"
                                    isFocus
                                    isDisabled={loading}
                                    placeholder="Input Subproject Title"
                                    tabIndex={1}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="component"
                                    label="Component"
                                    type='select'
                                    selectOptions={[
                                        { label: 'Infrastructure', value: 'IN' },
                                        { label: 'Enterprise', value: 'EN' },
                                    ]}
                                    isDisabled={loading}
                                    placeholder="Select Component"
                                    tabIndex={2}
                                />
                            </div>
                            {form.watch('component') == 'EN' &&
                                <div className="flex items-center space-x-2" tabIndex={3}>
                                    <Checkbox id="remember-password" checked={isChecked} onClick={() => setIsChecked(!isChecked)} disabled={loading} />
                                    <Label
                                        htmlFor="remember-password" // this matches the ID of the associated checkbox
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Check if enterprise has shared funding within infrastructure
                                    </Label>
                                </div>}

                            <FormFieldWrapper
                                control={form.control}
                                name="region"
                                label="Region"
                                type='select'
                                selectOptions={codeRegion.map((data) => ({
                                    label: data.label,
                                    value: data.value,
                                }))}
                                isDisabled={loading}
                                placeholder="Select Region"
                                tabIndex={4}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="province"
                                label="Province"
                                type='select'
                                selectOptions={filteredProvinces.map((data) => ({
                                    label: data.label,
                                    value: data.value,
                                }))}
                                isDisabled={loading || !selectedRegion} // Disable if no region is selected
                                placeholder="Select Province"
                                tabIndex={5}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="adLocation"
                                label="Ancestral Domain Location"
                                note="(4 characters only)"
                                isDisabled={loading}
                                placeholder="Input AD Location"
                                tabIndex={6}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="type"
                                label="Type"
                                type='select'
                                selectOptions={filteredType.map((data) => ({
                                    label: data.label,
                                    value: data.value,
                                }))}
                                isDisabled={loading || !selectedType}
                                placeholder="Select Type"
                                tabIndex={7}
                            />
                            <div className='flex flex-row justify-end'>
                                <Button
                                    className='mr-1'
                                    variant={'destructive'}
                                    disabled={loading}
                                    onClick={close}
                                    type='button'
                                >
                                    {loading && <LoadingSpinner />}  Cancel
                                </Button>
                                <Button
                                    disabled={loading}
                                    type='submit'
                                >
                                    {loading && <LoadingSpinner />}  Generate!
                                </Button>
                            </div>

                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <FinishedGeneratedCode 
                open={finishedGenerate} 
                close={() => setFinishedGenerate(!finishedGenerate)} 
                GeneratedCode={GeneratedCode}
                SubprojectTitle={subProjectTitle}
                SubprojectInformations={subProjectInformations} />
        </>
    )
}

export default GenerateCodeDialog