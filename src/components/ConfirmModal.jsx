"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone. This will permanently delete the data from our servers.",
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "destructive",
    isLoading = false,
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl p-8 border-none shadow-2xl bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
                <DialogHeader className="flex flex-col items-center text-center gap-4">
                    <div className={cn(
                        "p-4 rounded-2xl transition-colors",
                        variant === 'destructive'
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    )}>
                        {variant === 'destructive' ? <Trash2 className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 rounded-2xl h-12 font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={variant === 'destructive' ? 'destructive' : 'default'}
                        onClick={onConfirm}
                        className={cn(
                            "flex-1 rounded-2xl h-12 font-bold transition-all border-none",
                            variant === 'destructive'
                                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 text-white'
                        )}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
