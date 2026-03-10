// --- CONFIGURACIÓN GLOBAL ---
const baseAdministrativa = 120000;

// Formateador para moneda chilena (CLP)
const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
});

// --- LÓGICA DEL COTIZADOR (SECCIÓN PRECIOS) ---
const inputPisos = document.getElementById('inputPisos');
const inputTorres = document.getElementById('inputTorres');
const displayNeto = document.getElementById('totalNeto');
const displayIva = document.getElementById('totalIva');
const displayFinal = document.getElementById('totalFinal');
const formulaTexto = document.getElementById('formulaTexto');
const botonesPlan = document.querySelectorAll('.plan-select');

let precioPlanActual = 7000;
let nombrePlanActual = "Inspección Básica";

function calcularCotizador() {
    if(!inputPisos) return; // Seguridad por si no existe en la página
    const pisos = parseInt(inputPisos.value) || 0;
    const torres = parseInt(inputTorres.value) || 0;

    const neto = baseAdministrativa + (precioPlanActual * pisos * torres);
    const iva = Math.round(neto * 0.19);
    const total = neto + iva;

    if (displayNeto) displayNeto.innerHTML = `${formatter.format(neto)} <small class="fs-6 text-muted">CLP + IVA</small>`;
    if (displayIva) displayIva.innerText = formatter.format(iva);
    if (displayFinal) displayFinal.innerText = formatter.format(total);
    if (formulaTexto) formulaTexto.innerText = `Base administrativa: ${formatter.format(baseAdministrativa)} + ${nombrePlanActual}: ${formatter.format(precioPlanActual)} × ${pisos} × ${torres}`;
}

// --- LÓGICA DEL FORMULARIO DE CONTACTO ---
const formPisos = document.getElementById('formPisos');
const formPlanRadios = document.querySelectorAll('input[name="plan"]');
const formTotalDisplay = document.getElementById('formTotalDisplay');
const formTotalHidden = document.getElementById('formTotalHidden');

function actualizarPrecioFormulario() {
    if(!formPisos) return;
    const pisos = parseInt(formPisos.value) || 0;
    let precioBaseForm = 7000;

    formPlanRadios.forEach(radio => {
        if (radio.checked) {
            if (radio.value === "Avanzado") precioBaseForm = 12000;
            if (radio.value === "Integral") precioBaseForm = 22000;
        }
    });

    const neto = baseAdministrativa + (precioBaseForm * pisos);
    const textoTotal = `${formatter.format(neto)} CLP + IVA`;
    
    if (formTotalDisplay) formTotalDisplay.innerText = textoTotal;
    if (formTotalHidden) formTotalHidden.value = textoTotal;
}

// --- EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    // Eventos Cotizador
    if(inputPisos) {
        inputPisos.addEventListener('input', calcularCotizador);
        inputTorres.addEventListener('input', calcularCotizador);
        botonesPlan.forEach(boton => {
            boton.addEventListener('click', () => {
                botonesPlan.forEach(b => b.classList.remove('active'));
                boton.classList.add('active');
                precioPlanActual = parseInt(boton.getAttribute('data-precio'));
                nombrePlanActual = boton.getAttribute('data-nombre');
                calcularCotizador();
            });
        });
        calcularCotizador();
    }

    // Eventos Formulario
    if(formPisos) {
        formPisos.addEventListener('input', actualizarPrecioFormulario);
        formPlanRadios.forEach(radio => radio.addEventListener('change', actualizarPrecioFormulario));
        actualizarPrecioFormulario();
    }
});

