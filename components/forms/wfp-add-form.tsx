import { ChangeEvent, startTransition, useContext, useEffect, useState } from "react";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { WFPActivityFinancialMonthSchema, WFPActivityPhysicalMonthSchema, WFPActivitySchema } from "@/schemas";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BudgetLine, BudgetYear, ComponentsUnits, CostTabMajorActivity, CostTabSubActivity, OperatingUnit, TypeOfActivity, UACSCode, UnitOfMeasures } from "./data";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { WFPActivityAction } from "@/actions/wpf-activity";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

export const WFPForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [loading, setLoading] = useState(false);
    const [tempComponentUnitData, setTempComponentUnitData] = useState('');

    const combinedSchema = z.union([WFPActivitySchema, WFPActivityPhysicalMonthSchema,WFPActivityFinancialMonthSchema]);

    const form = useForm<z.infer<typeof combinedSchema>>({
        resolver: zodResolver(combinedSchema),
        defaultValues: {
            activityIdNumber: "",
            typeOfActivity: "",
            operatingUnit: "",
            componentsUnits: "",
            budgetYear: "",
            activities: "",
            costTabMajorActivity: "",
            costTabSubActivity: "",
            unitOfMeasure: "",
            physicalTarget: "",
            financialTotal: "",
            loanProceed: "",
            gopCounterpart: "",
            budgetLine: "",
            UACSCode: "",

            physicalJan: "12",
            physicalFeb: "",
            physicalMar: "",
            physicalApr: "",
            physicalMay: "",
            physicalJun: "",
            physicalJul: "",
            physicalAug: "",
            physicalSep: "",
            physicalOct: "",
            physicalNov: "",
            physicalDec: "",

            financialJan: "",
            financialFeb: "",
            financialMar: "",
            financialApr: "",
            financialMay: "",
            financialJun: "",
            financialJul: "",
            financialAug: "",
            financialSep: "",
            financialOct: "",
            financialNov: "",
            financialDec: "",

    
        }
    });

    const onSubmit = async () => {
        const values = form.getValues();
        console.log("values: ",values)
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            

            startTransition(() => {
                setLoading(true)
                WFPActivityAction(values)
                    .then((data) => {
                        setError(data.error)
                        setSuccess(data.success)
                        setTimeout(() => {
                            if (!data.error) {
                                toast({
                                    title: "Uploaded Success",
                                    description: "Test",
                                    duration:10000,
                                    action: (
                                      <ToastAction altText="Ok">Ok</ToastAction>
                                    ),
                                  })
                            }
                            setLoading(false)
                          }, 2000); // Delay for 2 seconds                      
                    });
            })
            setSuccess("Form submitted successfully!");
            localStorage.removeItem("WPFActivityData");
            location.reload()

        } catch (error) {
            setError("An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    }

    type Month = {
        name: string;
        label: string;
    };

    const PhysicalMonths: Month[] = [
        { name: "physicalJan", label: "Jan" },
        { name: "physicalFeb", label: "Feb" },
        { name: "physicalMar", label: "Mar" },
        { name: "physicalApr", label: "Apr" },
        { name: "physicalMay", label: "May" },
        { name: "physicalJun", label: "Jun" },
        { name: "physicalJul", label: "Jul" },
        { name: "physicalAug", label: "Aug" },
        { name: "physicalSep", label: "Sept" },
        { name: "physicalOct", label: "Oct" },
        { name: "physicalNov", label: "Nov" },
        { name: "physicalDec", label: "Dec" },
    ];

    const FinancialMonths: Month[] = [
        { name: "financialJan", label: "Jan" },
        { name: "financialFeb", label: "Feb" },
        { name: "financialMar", label: "Mar" },
        { name: "financialApr", label: "Apr" },
        { name: "financialMay", label: "May" },
        { name: "financialJun", label: "Jun" },
        { name: "financialJul", label: "Jul" },
        { name: "financialAug", label: "Aug" },
        { name: "financialSep", label: "Sept" },
        { name: "financialOct", label: "Oct" },
        { name: "financialNov", label: "Nov" },
        { name: "financialDec", label: "Dec" },
    ];

    const TargetsFields = [
        { name: 'physicalTarget', label: 'Physical Target' },
        { name: 'financialTotal', label: 'Financial (Total)' },
        { name: 'loanProceed', label: 'Loan Proceed' },
        { name: 'gopCounterpart', label: 'GOP Counterpart' }
    ];

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, monthName: string, field: any) => {
        const { name, value } = e.currentTarget;
        // Custom validation specific to the month's name
        if (name === monthName && !/^(?!0\d$)(\d*\.?\d*)$/.test(value)) return;
        // Call the original onChange function from react-hook-form
        field.onChange(e);
    };

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <Separator />
                    <div className="grid grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="activityIdNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Activity ID Number</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='typeOfActivity'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type of Activity</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an activity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TypeOfActivity.map((data, index) => (
                                                <SelectItem key={index} value={data.value}>{data.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='operatingUnit'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Operating Unit</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select operating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {OperatingUnit.map((data, index) => (
                                                <SelectItem key={index} value={data.value}>{data.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='componentsUnits'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Components/Units</FormLabel>
                                    <Select
                                        onValueChange={(value) => { field.onChange(value); setTempComponentUnitData('') }}
                                        defaultValue={field.value}
                                        disabled={loading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select component" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ComponentsUnits.map((data, index) => (
                                                <SelectItem className="cursor-pointer" key={index} value={data}>{data}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='budgetYear'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Budget Year</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select budget year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BudgetYear.map((data, index) => (
                                                <SelectItem className="cursor-pointer" key={index} value={data.value}>{data.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='activities'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Activities</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='costTabMajorActivity'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cost Tab Major Activity</FormLabel>
                                    <Select
                                        onValueChange={(value) => { field.onChange(value); setTempComponentUnitData(form.watch('componentsUnits')) }}
                                        defaultValue={field.value}
                                        disabled={!form.watch('componentsUnits')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select activity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {form.watch('componentsUnits') &&
                                                (CostTabMajorActivity.costTabMajorActivity[form.watch('componentsUnits')] || CostTabMajorActivity.costTabMajorActivity.OTHERS).map((data, index) => (
                                                    <SelectItem key={index} value={data}>{data}</SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='costTabSubActivity'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cost Tab Sub Activity</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={!form.watch('costTabMajorActivity')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select activity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {form.watch('costTabMajorActivity') &&
                                                (CostTabSubActivity.costTabSubActivity[form.watch('costTabMajorActivity')] || CostTabSubActivity.costTabSubActivity.OTHERS).map((data, index) => (
                                                    form.watch('componentsUnits') == tempComponentUnitData && (
                                                        <SelectItem key={index} value={data}>{data}</SelectItem>
                                                    )
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Separator />
                    {/**TARGET */}
                    <Label className="font-bold underline">Target</Label>
                    <div className="grid grid-cols-5 gap-6">
                        <FormField
                            name='unitOfMeasure'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit of Measures</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={loading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {UnitOfMeasures.map((data, index) => (
                                                <SelectItem className="cursor-pointer" key={index} value={data}>{data}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {TargetsFields.map(data => (
                            <FormField
                                key={data.name}
                                control={form.control}
                                name={data.name as any} // Explicitly cast to string
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{data.label}</FormLabel>
                                        <Input
                                            {...field}
                                            type="text" // Change the type to text to allow for custom input validation
                                            min="0"
                                            disabled={loading}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, data.name, field)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                    <Separator />
                    <Label className="font-bold underline">Timeframe (Physical)</Label>
                    <div>
                        <div className="grid grid-cols-12 gap-2">
                            {PhysicalMonths.map(month => (
                                <FormField
                                    key={month.name}
                                    control={form.control}
                                    name={month.name as any} // Explicitly cast to string
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{month.label}</FormLabel>
                                            <Input
                                                {...field}
                                                type="text" // Change the type to text to allow for custom input validation
                                                min="0"
                                                disabled={loading}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, month.name, field)}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    <Label className="font-bold underline">Timeframe (Financial)</Label>
                    <div>
                        <div className="grid grid-cols-12 gap-2">
                            {FinancialMonths.map(month => (
                                <FormField
                                    key={month.name}
                                    control={form.control}
                                    name={month.name as any} // Explicitly cast to string
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{month.label}</FormLabel>
                                            <Input
                                                {...field}
                                                type="text" // Change the type to text to allow for custom input validation
                                                min="0"
                                                disabled={loading}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, month.name, field)}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                    <Separator />
                    {/**UACS CODE */}
                    <Label className="font-bold underline">UACS Code</Label>
                    <div className="grid grid-cols-2 gap-6">
                        <FormField
                            name='budgetLine'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Budget Line</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={loading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select budget line" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BudgetLine.map((data, index) => (
                                                <SelectItem className="cursor-pointer" key={index} value={data}>{data}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='UACSCode'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>UACS Code</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={!form.watch('budgetLine')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select activity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {form.watch('budgetLine') &&
                                                (UACSCode.uacsCode[form.watch('budgetLine')]).map((data, index) => (
                                                    <SelectItem key={index} value={data}>{data}</SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={loading}
                    >
                        {loading && "Savings..."}
                        {!loading && "Save"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
