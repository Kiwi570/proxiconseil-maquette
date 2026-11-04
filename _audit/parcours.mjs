/* Parcours propres à Proxiconseil : formulaire en quatre étapes (prérempli, récapitulatif, double clic)
   et boussole des objectifs (choix de situation, lien prérempli). */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/contact?sujet=retraite#rendez-vous', { waitUntil: 'load' });
      await attendrePret(page);
      const coche = await page.evaluate(() => document.querySelector('input[name="sujet"][value="retraite"]')?.checked);
      if (!coche) R.echec('formulaire', 'le sujet « retraite » de l’adresse n’est pas présélectionné', { page: '/contact', taille: '390×844' });
      const recap = await page.evaluate(() => document.querySelector('[data-recap="sujet"]')?.textContent.trim());
      if (recap !== 'Retraite') R.echec('formulaire', `récapitulatif « ${recap} » au lieu de « Retraite »`, { page: '/contact' });
      for (let i = 0; i < 3; i++) { await page.click('[data-suivant]'); await attendre(550); }
      const etape4 = await page.evaluate(() => !document.querySelector('[data-etape="4"]').hidden);
      if (!etape4) R.echec('formulaire', 'l’étape 4 ne s’affiche pas après trois clics sur Suivant', { page: '/contact' });
      await page.fill('#f-nom', 'Essai Audit');
      await page.fill('#f-tel', '06 00 00 00 00');
      await page.check('#f-accord');
      await page.dblclick('[data-envoyer]');
      await attendre(400);
      const fin = await page.evaluate(() => ({ msg: !document.querySelector('[data-message-envoi]').hidden, bloque: document.querySelector('[data-envoyer]').disabled }));
      if (!fin.msg) R.echec('formulaire', 'aucun message après l’envoi simulé', { page: '/contact' });
      if (!fin.bloque) R.echec('formulaire', 'le bouton d’envoi reste actif (double envoi possible)', { page: '/contact' });
    } finally { await ctx.close(); }
  }
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/accompagnement#boussole', { waitUntil: 'load' });
      await attendrePret(page);
      await page.click('input[name="situation"][value="entreprise"]', { force: true });
      await attendre(300);
      const r = await page.evaluate(() => ({ noms: document.querySelector('[data-boussole-noms]').textContent, lien: document.querySelector('[data-boussole-lien]').getAttribute('href'), allumes: document.querySelectorAll('.anneaux--boussole .anneau.allume').length }));
      if (!/Trésorerie/.test(r.noms)) R.echec('boussole', `objectifs affichés : ${r.noms}`, { page: '/accompagnement' });
      if (!/sujet=tresorerie/.test(r.lien)) R.echec('boussole', `lien du bouton : ${r.lien}`, { page: '/accompagnement' });
      if (r.allumes !== 3) R.echec('boussole', `${r.allumes} anneaux allumés au lieu de 3`, { page: '/accompagnement' });
    } finally { await ctx.close(); }
  }
}
