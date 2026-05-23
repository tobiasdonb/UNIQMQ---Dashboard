const pool = require('../src/config/db');
const deviceManager = require('../src/services/DeviceManager');

class DeviceController {
    // WEB: List Devices
    async getDashboard(req, res) {
        try {
            const [devices] = await pool.query(`
                SELECT d.* FROM device d 
                JOIN user u ON d.user_id = u.user_id 
                WHERE u.user_name = ? 
                ORDER BY d.device_id DESC
            `, [req.session.username]);

            const processedDevices = devices.map(device => {
                let link = '#';
                let badge_color = 'bg-gray-100 text-gray-600';
                let current_icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>';
                
                if (device.device_type.includes('inkubator')) {
                    link = '/incubator/' + device.device_id;
                    current_icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-brown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9a4 4 0 0 0-2 7.5M12 3v2M6.6 18.4l-1.4 1.4M18.8 4.2l-1.4 1.4M2 12h2M20 12h2M6.6 5.6l-1.4-1.4M18.8 19.8l-1.4-1.4"/></svg>';
                    badge_color = 'bg-[#FFF8EC] text-accent-brown border border-accent-brown/20';
                } else if (device.device_type.includes('lamp')) {
                    link = '/smartlamp/' + device.device_id;
                    current_icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 16.5 8 4.5 4.5 0 0 0 12 3.5 4.5 4.5 0 0 0 7.5 8c0 1.5.81 2.82 2 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>';
                    badge_color = 'bg-blue-50 text-accent-blue border border-accent-blue/20';
                }

                return {
                    ...device,
                    id_val: device.device_id,
                    primary_key: 'device_id',
                    displayName: device.device_name || device.device_type,
                    link,
                    badge_color,
                    current_icon
                };
            });

            res.render('dashboard', {
                page_title: 'UNIMQ - Dashboard',
                body_class: 'bg-cream-bg text-dark-text min-h-screen font-sans selection:bg-accent-green selection:text-white pb-20',
                username: req.session.username,
                devices: processedDevices
            });
        } catch (e) {
            console.error(e);
            res.send('Error loading dashboard');
        }
    }

    // WEB: Handle Add/Edit/Delete
    async handleDashboardPost(req, res) {
        try {
            const id_pemilik = req.session.user_id;
            
            if (req.body.add_device !== undefined) {
                const { device_name, device_type, broker_url, mq_user, mq_pass, broker_port } = req.body;
                await pool.query(
                    "INSERT INTO device (user_id, device_name, broker_url, mq_user, mq_pass, device_type, broker_port) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [id_pemilik, device_name, broker_url, mq_user, mq_pass, device_type, broker_port]
                );
                req.session.toast = { type: 'success', message: 'Berhasil tambah device!' };
                deviceManager.syncDevices(); 
            } else if (req.body.edit_device !== undefined) {
                const { edit_device_id, edit_device_name, edit_device_type, edit_broker_url, edit_broker_port, edit_mq_user, edit_mq_pass } = req.body;
                await pool.query(
                    "UPDATE device SET device_name=?, device_type=?, broker_url=?, broker_port=?, mq_user=?, mq_pass=? WHERE device_id=? AND user_id=?",
                    [edit_device_name, edit_device_type, edit_broker_url, edit_broker_port, edit_mq_user, edit_mq_pass, edit_device_id, id_pemilik]
                );
                req.session.toast = { type: 'success', message: 'Berhasil update device!' };
                deviceManager.syncDevices();
            } else if (req.body.btn_hapus_pintar !== undefined) {
                const { id_hapus_target, nama_kolom_target } = req.body;
                if (nama_kolom_target === 'device_id') {
                    await pool.query("DELETE FROM device WHERE device_id = ? AND user_id = ?", [id_hapus_target, id_pemilik]);
                    req.session.toast = { type: 'success', message: 'Berhasil! Device terhapus.' };
                    deviceManager.syncDevices();
                }
            }
        } catch (e) {
            req.session.toast = { type: 'error', message: 'Action failed: ' + e.message };
        }
        res.redirect('/dashboard');
    }

    // API: Get all devices
    async apiGetDevices(req, res) {
        try {
            const [devices] = await pool.query('SELECT * FROM device WHERE user_id = ?', [req.user.user_id]);
            res.json(devices);
        } catch (e) {
            res.status(500).json({ error: 'Failed to fetch devices' });
        }
    }
}

module.exports = new DeviceController();
