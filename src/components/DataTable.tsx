import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";

type PropsDataTable<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    pageSize: number;
    filterColumnList: string[];
};

export function DataTable<T>({
    data,
    columns,
    pageSize,
    filterColumnList,
}: PropsDataTable<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [currentColumnFilter, setCurrentColumnFilter] = useState(
        filterColumnList?.at(0) ?? null
    );
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});

    useEffect(() => {
        setRowSelection({});
    }, [data]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
        autoResetPageIndex: false,
        autoResetExpanded: false,
    });

    if (import.meta.env.VITE_DEBUG) {
        console.log({ filterColumnList });
        console.log({ currentColumnFilter });
        console.log({ columns });
        const count = useRef(0);

        useEffect(() => {
            count.current = count.current + 1;
            console.log("Data Table render: ", count.current);
        });
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 grid-rows-1 items-center py-4">
                {currentColumnFilter?.length && (
                    <div className="flex">
                        <Input
                            placeholder={`Filtrar por ${currentColumnFilter}...`}
                            value={
                                (table
                                    .getColumn(currentColumnFilter)
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn(currentColumnFilter)
                                    ?.setFilterValue(event.target.value)
                            }
                            className="max-w-xs md:max-w-sm md:text-lg"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <ChevronDown className="mt-2 -ml-8 hover:cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {filterColumnList.map((item) => (
                                    <DropdownMenuCheckboxItem
                                        key={"filter-" + item}
                                        className="capitalize"
                                        checked={item === currentColumnFilter}
                                        onCheckedChange={() => {
                                            table
                                                .getColumn(
                                                    currentColumnFilter.toString()
                                                )
                                                ?.setFilterValue("");

                                            setCurrentColumnFilter(item);
                                        }}
                                    >
                                        {item}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="ml-auto md:text-lg"
                        >
                            Columnas <ChevronDown className="ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center md:text-lg"
                                >
                                    No hay datos.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 md:text-lg text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} fila(s)
                    seleccionada(s).
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="default"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="default"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
