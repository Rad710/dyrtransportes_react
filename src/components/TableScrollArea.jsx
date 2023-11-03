import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { Table } from "@radix-ui/themes"
import { useState } from "react"
import { TableVirtuoso } from 'react-virtuoso';




const TableComponents = {
    // Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
    // Table: (props) => <Table {...props} style={{ borderCollapse: 'separate' }} />,
    // TableHead: TableHead,
    TableRow: Table.Row,
    // TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
}

const TableScrollArea = () => {
    const [scrollParent, setScrollParent] = useState();

    // Create an empty array to store the objects
    const dataArray = [];

    // Define the data to be filled in the objects
    const data = {
        name: 'AAA',
        email: 'BBB',
        title: 'CCC',
    };

    // Fill the array with 1000 entries, each containing the data
    for (let i = 0; i < 10000; i++) {
        dataArray.push({ ...data });
    }

    const TableRowPeople = ({ person }) => {
        return (
            <>
                <Table.Cell>{person.name}</Table.Cell>
                <Table.Cell>{person.email}</Table.Cell>
                <Table.Cell>{person.title}</Table.Cell>
            </>
        )
    }


    return (
        <ScrollAreaPrimitive.Root>
            <ScrollAreaPrimitive.Viewport ref={setScrollParent} className={`h-[300px]`}>

                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                </Table.Root>

                <TableVirtuoso
                    data={dataArray}
                    itemContent={(index, person) => <TableRowPeople person={person} />}
                    customScrollParent={scrollParent ?? undefined}
                    components={TableComponents}
                />

            </ScrollAreaPrimitive.Viewport>
            <ScrollAreaPrimitive.Scrollbar
                orientation="vertical"
            >
                <ScrollAreaPrimitive.Thumb />
            </ScrollAreaPrimitive.Scrollbar>
        </ScrollAreaPrimitive.Root>
    )

};

export default TableScrollArea