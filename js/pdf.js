function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margem = 14;
  const dataAtual = new Date();

  if (!fichasCache || fichasCache.length === 0) {
    alert("Não há fichas para gerar o PDF.");
    return;
  }

  const fichasOrdenadas = [...fichasCache].sort((a, b) => new Date(a.data) - new Date(b.data));
  const mesAnoReferencia = new Date(fichasOrdenadas[0].data).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  const formatarCabecalho = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 152, 0);
    doc.text("Relatório de Ações SEMPDEC", pageWidth / 2, 20, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Mês de referência: ${mesAnoReferencia}`, pageWidth / 2, 28, { align: 'center' });
  };

  const formatarRodape = (paginaAtual, totalPaginas) => {
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Data de emissão: ${dataAtual.toLocaleDateString('pt-BR')}`, margem, pageHeight - 10);
    doc.text(`Página ${paginaAtual} de ${totalPaginas}`, pageWidth - margem, pageHeight - 10, { align: 'right' });
  };

  const corpoTabela = fichasOrdenadas.map(ficha => ([
    formatarDataBR(ficha.data),
    ficha.localidade,
    ficha.acao,
    Array.isArray(ficha.responsavel) ? ficha.responsavel.join(', ') : ficha.responsavel,
    ficha.observacao || '-'
  ]));

  doc.autoTable({
    head: [['Data', 'Localidade', 'Ação', 'Responsável', 'Observação']],
    body: corpoTabela,
    startY: 36,
    margin: { left: margem, right: margem },
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: {
      fillColor: [255, 152, 0],
      textColor: 255,
      halign: 'center'
    },
    bodyStyles: { valign: 'top' },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 35 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
      4: { cellWidth: 45 }
    },
    didDrawPage: () => formatarCabecalho()
  });

  const totalPaginas = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    formatarRodape(i, totalPaginas);
  }

  doc.save("relatorio_sempdec.pdf");
}