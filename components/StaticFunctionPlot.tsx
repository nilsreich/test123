// components/StaticFunctionPlot.tsx
"use client";

import { useEffect, useRef } from 'react';

// --- Die FunctionPlotter-Klasse (bleibt intern in dieser Komponente) ---
class FunctionPlotter {
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    width!: number;
    height!: number;
    config!: any;

    constructor(canvasElement: HTMLCanvasElement, config: any) {
        if (!canvasElement) return;
        this.canvas = canvasElement;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2d context from canvas');
        this.ctx = ctx;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.config = {
            viewBox: [-10, 10, -10, 10], functions: [], points: [],
            labelStepX: 1, labelStepY: 1, ...config
        };
        this.draw();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawAxes();
        if (this.config.functions) {
            this.config.functions.forEach((f: { func: string; color: string; }) => this.drawFunction(f.func, f.color));
        }
        if (this.config.points) {
            this.config.points.forEach((p: { x: number; y: number; label: string; color: string | undefined; }) => this.drawPoint(p.x, p.y, p.label, p.color));
        }
    }

    mapCoords(x: number, y: number) {
        const { viewBox } = this.config;
        const [minX, maxX, minY, maxY] = viewBox;
        const scaleX = this.width / (maxX - minX);
        const scaleY = this.height / (maxY - minY);
        const canvasX = (x - minX) * scaleX;
        const canvasY = this.height - (y - minY) * scaleY;
        return { x: canvasX, y: canvasY };
    }

    drawAxes() {
        const { viewBox, labelStepX, labelStepY } = this.config;
        const [minX, maxX, minY, maxY] = viewBox;
        const origin = this.mapCoords(0, 0);
        this.ctx.strokeStyle = '#a0aec0';
        this.ctx.fillStyle = '#718096';
        this.ctx.lineWidth = 1.5;
        this.ctx.font = '14px Nunito, sans-serif';
        this.ctx.beginPath(); this.ctx.moveTo(0, origin.y); this.ctx.lineTo(this.width, origin.y); this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.moveTo(origin.x, 0); this.ctx.lineTo(origin.x, this.height); this.ctx.stroke();
        for (let i = Math.ceil(minX / labelStepX) * labelStepX; i <= maxX; i += labelStepX) {
            if (i === 0) continue;
            const pos = this.mapCoords(i, 0);
            this.ctx.fillText(i.toString(), pos.x - 5, pos.y + 20);
            this.ctx.beginPath(); this.ctx.moveTo(pos.x, origin.y - 4); this.ctx.lineTo(pos.x, origin.y + 4); this.ctx.stroke();
        }
        for (let i = Math.ceil(minY / labelStepY) * labelStepY; i <= maxY; i += labelStepY) {
            if (i === 0) continue;
            const pos = this.mapCoords(0, i);
            this.ctx.fillText(i.toString(), pos.x + 10, pos.y + 5);
             this.ctx.beginPath(); this.ctx.moveTo(origin.x - 4, pos.y); this.ctx.lineTo(origin.x + 4, pos.y); this.ctx.stroke();
        }
    }

    // HIER IST DIE KORRIGIERTE METHODE
    parseFunction(funcStr: string) {
        // Ersetze alle Vorkommen von '^' mit dem korrekten JavaScript-Exponent-Operator '**'
        const safeFuncStr = funcStr.replace(/\s+/g, '').replace(/\^/g, '**');
        return (x: number) => {
            try { 
                // Multiplikationszeichen vor x einfügen, wenn eine Zahl davorsteht (z.B. 300x -> 300*x)
                const finalFuncStr = safeFuncStr.replace(/(\d)x/g, '$1*x');
                return new Function('x', `return ${finalFuncStr}`)(x); 
            } catch (e) { 
                console.error("Error parsing function:", e);
                return NaN; 
            }
        };
    }

    drawFunction(funcStr: string, color: string) {
        const func = this.parseFunction(funcStr);
        const { viewBox } = this.config;
        const [minX, maxX] = viewBox;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        let firstPoint = true;
        for (let canvasX = 0; canvasX <= this.width; canvasX++) {
            const mathX = minX + (canvasX / this.width) * (maxX - minX);
            const mathY = func(mathX);
            if (!isNaN(mathY) && isFinite(mathY)) {
                const { y: canvasY } = this.mapCoords(mathX, mathY);
                if (firstPoint) { this.ctx.moveTo(canvasX, canvasY); firstPoint = false; } 
                else { this.ctx.lineTo(canvasX, canvasY); }
            }
        }
        this.ctx.stroke();
    }
    
    drawPoint(x: number, y: number, label: string, color: string = '#333') {
        const pos = this.mapCoords(x, y);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 6, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.fillStyle = document.body.classList.contains('dark') ? '#cbd5e1' : '#1a202c';
        this.ctx.font = 'bold 16px Nunito, sans-serif';
        this.ctx.fillText(label, pos.x + 10, pos.y - 10);
    }
}

interface StaticFunctionPlotProps {
    functions: { func: string; color: string }[];
    points?: { x: number; y: number; label: string; color?: string }[];
    viewBox: [number, number, number, number];
    labelStepX?: number;
    labelStepY?: number;
    width?: number;
    height?: number;
    className?: string;
}

const StaticFunctionPlot = ({
    functions,
    points = [],
    viewBox,
    labelStepX = 1,
    labelStepY = 1,
    width = 800,
    height = 600,
    className = "h-auto w-full",
}: StaticFunctionPlotProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            new FunctionPlotter(canvasRef.current, {
                functions,
                points,
                viewBox,
                labelStepX,
                labelStepY,
            });
        }
    }, [functions, points, viewBox, labelStepX, labelStepY, width, height]);

    return (
        <div className="mt-4 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/50">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className={className}
            />
        </div>
    );
};

export default StaticFunctionPlot;