"use client";
import {
    Document,
    Page,
    View,
    Text,
    StyleSheet,
} from "@react-pdf/renderer";
import { ProcessDocReportType } from "../components/forms/ProcessDocumentReportForm";
import { format } from "date-fns";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 9,
        fontFamily: "Helvetica",
        flexDirection: "column",
    },
    sectionTitle: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 10,
        fontWeight: "bold",
    },
    table: {
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 4,
        flexGrow: 1,
    },
    bold: {
        fontWeight: "bold",
    },
    rowTall: {
        flexGrow: 1,
        flexDirection: "row",          // Required for horizontal layout
        alignItems: "center",          // Center content vertically
        justifyContent: "center",      // Optional: center content horizontally (adjust as needed)
    },
    innerCell: {
        flexGrow: 1,
        padding: 4,
        textAlign: "left",
        justifyContent: "center",
        alignItems: "flex-start",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderStyle: "solid",
    },
    nestedCell: {
        flexGrow: 1,
        padding: 4,
        borderWidth: 0.5,
        borderStyle: "solid",
        justifyContent: "center",
        textAlign: "left",
    },
});



interface Props {
    processDocumentReportData: ProcessDocReportType;
}

const formatDate = (d: any) => d ? format(new Date(d), "MMMM dd, yyyy") : "";

const ProcessDocReportPDF = ({ processDocumentReportData }: Props) => {
    const d = processDocumentReportData;

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* PDF Title */}
                <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 10, fontWeight: "bold" }}>
                    Process Documentation Report
                </Text>

                {/* Section Heading */}
                <Text style={styles.sectionTitle}>1. Activity Brief</Text>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }]}>Activity Title/Name:</Text>
                        <Text style={[styles.cell, { flex: 3 }]}>{d.activityTitle}</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>Date Conducted:</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{formatDate(d.dateConducted)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }]}>WFP Activity:</Text>
                        <Text style={[styles.cell, { flex: 3 }]}>{d.preActivityDescription}</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>Venue:</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>
                            {`${d.baranggay}, ${d.municipality}, ${d.province}, ${d.region}`}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }]}>Activity Objective(s):</Text>
                        <Text style={[styles.cell, { flex: 3 }]}>{d.activityObjectives}</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>Total Participants</Text>
                        <View style={[styles.cell, { flex: 2, padding: 0 }]}>
                            <View style={[styles.row, styles.rowTall]}>
                                <Text style={[styles.nestedCell, { flex: 1, fontWeight: "bold", textAlign: "center" }]}>-</Text>
                                <Text style={[styles.nestedCell, { flex: 1, fontWeight: "bold", textAlign: "center" }]}>Male</Text>
                                <Text style={[styles.nestedCell, { flex: 1, fontWeight: "bold", textAlign: "center" }]}>Female</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={[styles.nestedCell, { flex: 1 }]}>IP</Text>
                                <Text style={[styles.nestedCell, { flex: 1, textAlign: "center" }]}>{d.totalMaleIP}</Text>
                                <Text style={[styles.nestedCell, { flex: 1, textAlign: "center" }]}>{d.totalFemaleIP}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={[styles.nestedCell, { flex: 1 }]}>Non-IP</Text>
                                <Text style={[styles.nestedCell, { flex: 1, textAlign: "center" }]}>{d.totalMaleNonIP}</Text>
                                <Text style={[styles.nestedCell, { flex: 1, textAlign: "center" }]}>{d.totalFemaleNonIP}</Text>
                            </View>
                        </View>

                    </View>
                </View>

                {/* Process Documentation Table */}
                <Text style={styles.sectionTitle}>2. Process Documentation</Text>

                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }]}>Input</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>Process Description and Highlights</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>Output Qty</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>Output Description</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>Outcome (Immediate)</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>Emerging Impact (Long-term)</Text>
                    </View>

                    {/* Pre-Activity Row */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }]}>Pre-Activity</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.preActivityDescription}</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>{d.preActivityOutputQty}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.preActivityOutputDescription}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.preActivityOutcome}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.preActivityEmergingImpact}</Text>
                    </View>

                    {/* During Activity Row */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }]}>During</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.duringDescription}</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>{d.duringOutputQty}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.duringOutputDescription}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.duringOutcome}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.duringEmergingImpact}</Text>
                    </View>

                    {/* Post-Activity Row */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }]}>Post-Activity</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.postActivityDescription}</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>{d.postActivityOutputQty}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.postActivityOutputDescription}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.postActivityOutcome}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{d.postActivityEmergingImpact}</Text>
                    </View>
                </View>

                {/* Attachments */}
                <Text style={styles.sectionTitle}>
                    3. Attachments: a. Attendance Sheet, b. Program, c. Photo Documentation,
                    d. Participant&apos;s Profile, e. Presentation Materials (REQUIRED MOVs)
                </Text>

                {/* Signatories */}
                <View style={styles.table}>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }, styles.bold, { textAlign: 'center' }]}>Prepared and Submitted by:</Text>
                        <Text style={[styles.cell, { flex: 1 }, styles.bold, { textAlign: 'center' }]}>Reviewed by:</Text>
                        <Text style={[styles.cell, { flex: 1 }, styles.bold, { textAlign: 'center' }]}>Noted by:</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }, { textAlign: 'center' }]}>{d.preparedByName}</Text>
                        <Text style={[styles.cell, { flex: 1 }, { textAlign: 'center' }]}>{d.reviewedByName}</Text>
                        <Text style={[styles.cell, { flex: 1 }, { textAlign: 'center' }]}>{d.notedByName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }, { textAlign: 'center' }]}>PSP Officer</Text>
                        <Text style={[styles.cell, { flex: 1 }, { textAlign: 'center' }]}>SP Specialist</Text>
                        <Text style={[styles.cell, { flex: 1 }, { textAlign: 'center' }]}>C1 Component Head</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }, { textAlign: 'center' }]}>()</Text>
                        <Text style={[styles.cell, { flex: 1 }, { textAlign: 'center' }]}>(date)</Text>
                        <Text style={[styles.cell, { flex: 1 }, { textAlign: 'center' }]}>(date)</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ProcessDocReportPDF;
