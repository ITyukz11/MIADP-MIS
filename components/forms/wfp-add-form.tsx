import { useState } from "react";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { WFPActivitySchema } from "@/schemas";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BudgetLine, BudgetYear, ComponentsUnits, CostTabMajorActivity, CostTabSubActivity, OperatingUnit, TypeOfActivity, UACSCode, UnitOfMeasures } from "./data";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";

export const WFPForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [loading, setLoading] = useState(false);
    const [tempComponentUnitData, setTempComponentUnitData] = useState('');

    const form = useForm<z.infer<typeof WFPActivitySchema>>({
        resolver: zodResolver(WFPActivitySchema),
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
            physicalQ1:"",
            physicalQ2:"",
            physicalQ3:"",
            physicalQ4:"",
            financialQ1:"",
            financialQ2:"",
            financialQ3:"",
            financialQ4:"",        
        }
    });

    const onSubmit = async (values: z.infer<typeof WFPActivitySchema>) => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Your form submission logic here...
            setSuccess("Form submitted successfully!");
        } catch (error) {
            setError("An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <Separator />
                    <div className="grid grid-cols-2 gap-6">
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
                                                    form.watch('componentsUnits') !== tempComponentUnitData && (
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
                    <Label className="font-bold underline">Target</Label>
                    <div className="grid grid-cols-2 gap-6">
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
                        <FormField
                            control={form.control}
                            name="physicalTarget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Physical Target</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="financialTotal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Financial (Total)</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="loanProceed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loan Proceed</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gopCounterpart"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GOP Counterpart</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Separator />
                    <Label className="font-bold underline">Timeframe (Physical)</Label>
                    <div>
                        <div className="grid grid-cols-4 gap-2">
                        <FormField
                            control={form.control}
                            name="financialQ1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qtr 1</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                          <FormField
                            control={form.control}
                            name="financialQ2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qtr 2</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                          <FormField
                            control={form.control}
                            name="financialQ3"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qtr 3</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                          <FormField
                            control={form.control}
                            name="financialQ4"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qtr 4</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>          
                    </div>
                    <Label className="font-bold underline">Timeframe (Financial)</Label>
                    <div>
                        <div className="grid grid-cols-4 gap-2">
                        <FormField
                            control={form.control}
                            name="physicalQ1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qtr 1</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                          <FormField
                            control={form.control}
                            name="physicalQ2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qtr 2</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                          <FormField
                            control={form.control}
                            name="physicalQ3"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qtr 3</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                          <FormField
                            control={form.control}
                            name="physicalQ4"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qtr 4</FormLabel>
                                    <Input {...field} disabled={loading} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>          
                    </div>
                    <Separator />
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
